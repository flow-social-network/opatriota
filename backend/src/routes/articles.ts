import { ArticleStatus, UserRole } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError, readString } from "../lib/http.js";
import { requireAuth, requireRole, type AuthUser } from "../middleware/auth.js";

const router = Router();
const editorialRoles = [UserRole.JOURNALIST, UserRole.EDITOR, UserRole.ADMIN];

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
        id: true, slug: true, title: true, excerpt: true, heroImageUrl: true,
        publishedAt: true, seoTitle: true, seoDescription: true,
        author: { select: { displayName: true } },
        category: { select: { slug: true, name: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);
  res.json({ data: items, pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) } });
}));

router.get("/:slug", asyncHandler(async (req, res) => {
  const article = await prisma.article.findFirst({
    where: { slug: req.params.slug, status: ArticleStatus.PUBLISHED, publishedAt: { lte: new Date() } },
    select: {
      id: true, slug: true, title: true, excerpt: true, body: true, heroImageUrl: true,
      publishedAt: true, seoTitle: true, seoDescription: true, isSubscriberOnly: true,
      author: { select: { displayName: true } },
      category: { select: { slug: true, name: true } },
      sources: { include: { source: { select: { name: true, url: true, kind: true } } } },
      factChecks: { select: { claim: true, verdict: true, methodology: true, reviewedAt: true } },
    },
  });
  if (!article) throw new HttpError(404, "ARTICLE_NOT_FOUND", "Article not found");
  if (article.isSubscriberOnly) {
    // Paid-content enforcement must be connected to the subscription entitlement module before enabling subscriber-only publication.
    throw new HttpError(403, "SUBSCRIPTION_REQUIRED", "This article requires an active subscription");
  }
  res.json({ data: article });
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

  const data: Record<string, unknown> = { version: { increment: 1 } };
  if (req.body?.title !== undefined) data.title = readString(req.body.title, "title", 240);
  if (req.body?.body !== undefined) data.body = readString(req.body.body, "body", 100000);
  if (req.body?.excerpt !== undefined) data.excerpt = typeof req.body.excerpt === "string" ? req.body.excerpt.trim().slice(0, 1000) : null;
  if (req.body?.categoryId !== undefined) data.categoryId = req.body.categoryId || null;
  if (req.body?.status !== undefined) {
    if (user.role === UserRole.JOURNALIST) throw new HttpError(403, "FORBIDDEN", "Journalists cannot change article publication status");
    const allowed = [ArticleStatus.DRAFT, ArticleStatus.PITCH, ArticleStatus.IN_REVIEW, ArticleStatus.APPROVED, ArticleStatus.SCHEDULED, ArticleStatus.PUBLISHED, ArticleStatus.ARCHIVED];
    if (!allowed.includes(req.body.status)) throw new HttpError(400, "VALIDATION_ERROR", "Invalid article status");
    if (req.body.status === ArticleStatus.PUBLISHED && user.role !== UserRole.EDITOR && user.role !== UserRole.ADMIN) {
      throw new HttpError(403, "FORBIDDEN", "Only editors and admins can publish articles");
    }
    data.status = req.body.status;
    data.publishedAt = req.body.status === ArticleStatus.PUBLISHED ? new Date() : null;
  }
  const article = await prisma.article.update({
    where: { id: existing.id },
    data: data as never,
    select: { id: true, title: true, slug: true, status: true, version: true, updatedAt: true },
  });
  res.json({ data: article });
}));

export default router;
