import { ArticleStatus, EditorialRiskLevel, UserRole } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError, readString } from "../lib/http.js";
import { requireAuth, requireRole, type AuthUser } from "../middleware/auth.js";

const router = Router();
const editorialRoles = [UserRole.JOURNALIST, UserRole.EDITOR, UserRole.CHIEF_EDITOR, UserRole.ADMIN];
const approverRoles: UserRole[] = [UserRole.REVIEWER, UserRole.EDITOR, UserRole.CHIEF_EDITOR, UserRole.ADMIN];
const submitAllowedStatuses = new Set<ArticleStatus>([ArticleStatus.DRAFT, ArticleStatus.PITCH, ArticleStatus.CHANGES_REQUESTED]);
const approvalInvalidatingStatuses = new Set<ArticleStatus>([ArticleStatus.APPROVED, ArticleStatus.SCHEDULED, ArticleStatus.PUBLISHED]);

router.get("/", asyncHandler(async (req, res) => {
  const page = Math.max(1, Math.min(10000, Number.parseInt(String(req.query.page ?? "1"), 10) || 1));
  const pageSize = Math.max(1, Math.min(50, Number.parseInt(String(req.query.pageSize ?? "20"), 10) || 20));
  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
  const where = {
    status: ArticleStatus.PUBLISHED,
    publishedAt: { lte: new Date() },
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.article.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, slug: true, title: true, excerpt: true, heroImageUrl: true, heroImageSourceUrl: true, heroImageCredit: true, canonicalUrl: true,
        publishedAt: true, seoTitle: true, seoDescription: true,
        author: { select: { displayName: true, disabledAt: true, journalistProfile: { select: { slug: true, status: true, verifiedAt: true, expiresAt: true } } } },
        category: { select: { slug: true, name: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);
  const now = new Date();
  const publicItems = items.map(item => {
    const profile = item.author.journalistProfile;
    const profileVerified = !item.author.disabledAt && profile?.status === "VERIFIED"
      && profile.verifiedAt !== null && (profile.expiresAt === null || profile.expiresAt > now);
    return { ...item, author: { displayName: item.author.displayName, profileSlug: profileVerified ? profile.slug : null } };
  });
  res.json({ data: publicItems, pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) } });
}));

router.get("/:slug", asyncHandler(async (req, res) => {
  const article = await prisma.article.findFirst({
    where: { slug: req.params.slug, status: ArticleStatus.PUBLISHED, publishedAt: { lte: new Date() } },
    select: {
      id: true, slug: true, title: true, excerpt: true, body: true, heroImageUrl: true, heroImageSourceUrl: true, heroImageCredit: true, canonicalUrl: true,
      publishedAt: true, seoTitle: true, seoDescription: true, isSubscriberOnly: true,
      author: { select: { displayName: true, disabledAt: true, journalistProfile: { select: { slug: true, status: true, verifiedAt: true, expiresAt: true } } } },
      category: { select: { slug: true, name: true } },
      sources: { include: { source: { select: { name: true, url: true, kind: true } } } },
      factChecks: { select: { claim: true, verdict: true, methodology: true, reviewedAt: true } },
    },
  });
  if (!article) throw new HttpError(404, "ARTICLE_NOT_FOUND", "Article not found");
  if (article.isSubscriberOnly) {
    throw new HttpError(403, "SUBSCRIPTION_REQUIRED", "This article requires an active subscription");
  }
  const profile = article.author.journalistProfile;
  const profileVerified = !article.author.disabledAt && profile?.status === "VERIFIED"
    && profile.verifiedAt !== null && (profile.expiresAt === null || profile.expiresAt > new Date());
  res.json({ data: { ...article, author: { displayName: article.author.displayName, profileSlug: profileVerified ? profile.slug : null } } });
}));

router.post("/", requireAuth, requireRole(...editorialRoles), asyncHandler(async (req, res) => {
  const user = res.locals.user as AuthUser;
  const title = readString(req.body?.title, "title", 240);
  const slug = readString(req.body?.slug, "slug", 240).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new HttpError(400, "VALIDATION_ERROR", "slug must contain lowercase letters, numbers and hyphens");
  const body = readString(req.body?.body, "body", 100000);
  const excerpt = typeof req.body?.excerpt === "string" ? req.body.excerpt.trim().slice(0, 1000) : null;
  const categoryId = typeof req.body?.categoryId === "string" ? req.body.categoryId : undefined;
  const article = await prisma.article.create({
    data: { title, slug, body, excerpt, authorId: user.id, categoryId, status: ArticleStatus.DRAFT },
    select: { id: true, title: true, slug: true, status: true, createdAt: true },
  });
  res.status(201).json({ data: article });
}));

router.patch("/:id", requireAuth, requireRole(...editorialRoles), asyncHandler(async (req, res) => {
  const user = res.locals.user as AuthUser;
  const existing = await prisma.article.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new HttpError(404, "ARTICLE_NOT_FOUND", "Article not found");
  if (user.role === UserRole.JOURNALIST && existing.authorId !== user.id) {
    throw new HttpError(403, "FORBIDDEN", "Journalists may edit only their own articles");
  }
  if (req.body?.status !== undefined) {
    throw new HttpError(400, "WORKFLOW_ENDPOINT_REQUIRED", "Use the submit, approve, or publish workflow endpoint to change editorial status");
  }

  const data: Record<string, unknown> = { version: { increment: 1 } };
  if (req.body?.title !== undefined) data.title = readString(req.body.title, "title", 240);
  if (req.body?.body !== undefined) data.body = readString(req.body.body, "body", 100000);
  if (req.body?.excerpt !== undefined) data.excerpt = typeof req.body.excerpt === "string" ? req.body.excerpt.trim().slice(0, 1000) : null;
  if (req.body?.categoryId !== undefined) data.categoryId = req.body.categoryId || null;

  const contentChanged = ["title", "body", "excerpt", "categoryId"].some((key) => req.body?.[key] !== undefined);
  if (contentChanged && approvalInvalidatingStatuses.has(existing.status)) {
    // Any content edit invalidates approval and removes the old public version until re-review.
    data.status = ArticleStatus.DRAFT;
    data.publishedAt = null;
    data.scheduledAt = null;
    data.humanApprovedAt = null;
    data.humanApprovedById = null;
  }

  const article = await prisma.article.update({
    where: { id: existing.id },
    data: data as never,
    select: { id: true, title: true, slug: true, status: true, version: true, updatedAt: true },
  });
  res.json({ data: article });
}));

router.post("/:id/submit", requireAuth, requireRole(...editorialRoles), asyncHandler(async (req, res) => {
  const user = res.locals.user as AuthUser;
  const article = await prisma.article.findUnique({ where: { id: req.params.id } });
  if (!article) throw new HttpError(404, "ARTICLE_NOT_FOUND", "Article not found");
  if (user.role === UserRole.JOURNALIST && article.authorId !== user.id) {
    throw new HttpError(403, "FORBIDDEN", "Journalists may submit only their own articles");
  }
  if (!submitAllowedStatuses.has(article.status)) {
    throw new HttpError(409, "INVALID_EDITORIAL_STATE", "Only drafts or articles requiring changes can be submitted");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.article.update({
      where: { id: article.id },
      data: { status: ArticleStatus.IN_REVIEW, humanApprovedAt: null, humanApprovedById: null, version: { increment: 1 } },
      select: { id: true, title: true, status: true, authorId: true, updatedAt: true },
    });
    await tx.auditEvent.create({
      data: { actorId: user.id, action: "ARTICLE_SUBMITTED_FOR_REVIEW", entityType: "Article", entityId: article.id, metadata: { fromStatus: article.status, toStatus: ArticleStatus.IN_REVIEW } },
    });
    const approvers = await tx.user.findMany({
      where: { role: { in: approverRoles }, disabledAt: null },
      select: { id: true },
    });
    await Promise.all(approvers.map((approver) => tx.notification.create({
      data: {
        userId: approver.id,
        type: "ARTICLE_REVIEW_REQUIRED",
        title: "Matéria aguarda aprovação humana",
        message: `A matéria "${article.title}" foi enviada para análise editorial.`,
        entityType: "Article",
        entityId: article.id,
      },
    })));
    return { article: result, notifiedApprovers: approvers.length };
  });
  res.status(200).json({ data: updated.article, notification: { required: true, recipients: updated.notifiedApprovers, channel: "IN_APP" } });
}));

router.post("/:id/approve", requireAuth, requireRole(...approverRoles), asyncHandler(async (req, res) => {
  const user = res.locals.user as AuthUser;
  const decision = req.body?.decision;
  const riskLevel = req.body?.riskLevel;
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim().slice(0, 10000) : null;
  const riskNotes = typeof req.body?.riskNotes === "string" ? req.body.riskNotes.trim().slice(0, 10000) : null;

  if (!["APPROVE", "REQUEST_CHANGES", "REJECT"].includes(decision)) {
    throw new HttpError(400, "VALIDATION_ERROR", "decision must be APPROVE, REQUEST_CHANGES or REJECT");
  }
  if (!Object.values(EditorialRiskLevel).includes(riskLevel)) {
    throw new HttpError(400, "VALIDATION_ERROR", "riskLevel must be LOW, MEDIUM, HIGH or CRITICAL");
  }

  const article = await prisma.article.findUnique({ where: { id: req.params.id } });
  if (!article) throw new HttpError(404, "ARTICLE_NOT_FOUND", "Article not found");
  if (article.status !== ArticleStatus.IN_REVIEW) {
    throw new HttpError(409, "INVALID_EDITORIAL_STATE", "Only articles in review can receive a human decision");
  }
  const selfApproval = article.authorId === user.id;
  if (selfApproval && user.role !== UserRole.ADMIN && user.role !== UserRole.CHIEF_EDITOR) {
    throw new HttpError(403, "SELF_APPROVAL_FORBIDDEN", "Authors cannot approve their own articles unless they are the designated chief editor or administrator");
  }
  if (riskLevel === EditorialRiskLevel.CRITICAL && decision === "APPROVE" && !notes) {
    throw new HttpError(400, "RISK_NOTES_REQUIRED", "Critical-risk approvals require documented human review notes");
  }

  const nextStatus = decision === "APPROVE"
    ? ArticleStatus.APPROVED
    : decision === "REQUEST_CHANGES"
      ? ArticleStatus.CHANGES_REQUESTED
      : ArticleStatus.REJECTED;
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.article.update({
      where: { id: article.id },
      data: {
        status: nextStatus,
        riskLevel,
        riskAssessment: { source: "human_review", riskLevel, riskNotes, notes, reviewerId: user.id, reviewedAt: now.toISOString() },
        humanApprovedAt: decision === "APPROVE" ? now : null,
        humanApprovedById: decision === "APPROVE" ? user.id : null,
        publishedAt: null,
        scheduledAt: null,
        version: { increment: 1 },
      },
      select: { id: true, title: true, slug: true, status: true, riskLevel: true, humanApprovedAt: true, humanApprovedById: true, updatedAt: true },
    });
    await tx.articleReview.create({
      data: { articleId: article.id, reviewerId: user.id, decision, riskLevel, riskNotes, notes, isSelfApproval: selfApproval },
    });
    await tx.auditEvent.create({
      data: {
        actorId: user.id,
        action: decision === "APPROVE" ? "ARTICLE_HUMAN_APPROVED" : decision === "REQUEST_CHANGES" ? "ARTICLE_CHANGES_REQUESTED" : "ARTICLE_REJECTED",
        entityType: "Article",
        entityId: article.id,
        metadata: { decision, riskLevel, selfApproval, previousStatus: article.status, nextStatus },
      },
    });
    return updated;
  });
  res.status(200).json({ data: result, public: false, nextAction: decision === "APPROVE" ? "SCHEDULE_OR_PUBLISH_SEPARATELY" : "AUTHOR_ACTION_REQUIRED" });
}));

router.post("/:id/publish", requireAuth, requireRole(UserRole.EDITOR, UserRole.CHIEF_EDITOR, UserRole.ADMIN), asyncHandler(async (req, res) => {
  const user = res.locals.user as AuthUser;
  const article = await prisma.article.findUnique({ where: { id: req.params.id } });
  if (!article) throw new HttpError(404, "ARTICLE_NOT_FOUND", "Article not found");
  if (article.status !== ArticleStatus.APPROVED || !article.humanApprovedAt || !article.humanApprovedById) {
    throw new HttpError(409, "HUMAN_APPROVAL_REQUIRED", "Only explicitly human-approved articles can be published");
  }
  const humanApprovedAt = article.humanApprovedAt!;
  const humanApprovedById = article.humanApprovedById!;
  const now = new Date();
  const published = await prisma.$transaction(async (tx) => {
    const result = await tx.article.update({
      where: { id: article.id },
      data: { status: ArticleStatus.PUBLISHED, publishedAt: now, version: { increment: 1 } },
      select: { id: true, title: true, slug: true, status: true, publishedAt: true, version: true },
    });
    await tx.auditEvent.create({
      data: { actorId: user.id, action: "ARTICLE_PUBLISHED", entityType: "Article", entityId: article.id, metadata: { humanApprovedById, humanApprovedAt: humanApprovedAt.toISOString() } },
    });
    return result;
  });
  res.status(200).json({ data: published });
}));

router.post("/:id/schedule", requireAuth, requireRole(UserRole.EDITOR, UserRole.CHIEF_EDITOR, UserRole.ADMIN), asyncHandler(async (req, res) => {
  const user = res.locals.user as AuthUser;
  const article = await prisma.article.findUnique({ where: { id: req.params.id } });
  if (!article) throw new HttpError(404, "ARTICLE_NOT_FOUND", "Article not found");
  if (article.status !== ArticleStatus.APPROVED && article.status !== ArticleStatus.SCHEDULED) {
    throw new HttpError(409, "APPROVAL_REQUIRED", "Only human-approved articles can be scheduled");
  }
  if (!article.humanApprovedAt || !article.humanApprovedById) {
    throw new HttpError(409, "HUMAN_APPROVAL_REQUIRED", "Only explicitly human-approved articles can be scheduled");
  }

  const raw = req.body?.scheduledAt;
  let scheduledAt: Date | null;
  if (raw === null || raw === undefined || raw === "") {
    scheduledAt = null;
  } else {
    if (typeof raw !== "string") throw new HttpError(400, "VALIDATION_ERROR", "scheduledAt must be an ISO date-time or null");
    scheduledAt = new Date(raw);
    if (Number.isNaN(scheduledAt.getTime())) throw new HttpError(400, "VALIDATION_ERROR", "scheduledAt is not a valid date-time");
    const now = Date.now();
    if (scheduledAt.getTime() <= now) throw new HttpError(400, "VALIDATION_ERROR", "scheduledAt must be in the future");
    if (scheduledAt.getTime() > now + 366 * 86400_000) throw new HttpError(400, "VALIDATION_ERROR", "scheduledAt must be within 366 days");
  }

  const nextStatus = scheduledAt ? ArticleStatus.SCHEDULED : ArticleStatus.APPROVED;
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.article.update({
      where: { id: article.id },
      data: { status: nextStatus, scheduledAt, version: { increment: 1 } },
      select: { id: true, slug: true, status: true, scheduledAt: true },
    });
    await tx.auditEvent.create({
      data: {
        actorId: user.id,
        action: scheduledAt ? "ARTICLE_SCHEDULED" : "ARTICLE_UNSCHEDULED",
        entityType: "Article",
        entityId: article.id,
        metadata: { fromStatus: article.status, toStatus: nextStatus, scheduledAt: scheduledAt?.toISOString() ?? null },
      },
    });
    return result;
  });
  res.json({ data: updated });
}));

export default router;
