import { Router } from "express";

import { prisma } from "../prisma.js";
import { sendOk } from "../utils/responses.js";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", async (_req, res) => {
  const [posts, pages, media, recentPosts, recentPages] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.media.count(),
    prisma.post.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.page.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);

  return sendOk(res, {
    counts: { posts, pages, media },
    recent: {
      posts: recentPosts,
      pages: recentPages,
    },
  });
});
