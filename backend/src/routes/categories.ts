import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { asyncHandler } from "../lib/http.js";

const router = Router();

router.get("/", asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { articles: { some: { status: "PUBLISHED", publishedAt: { lte: new Date() } } } },
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true, description: true },
  });
  res.json({ data: categories });
}));

export default router;
