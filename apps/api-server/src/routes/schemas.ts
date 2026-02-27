import { z } from "zod";

export const statusSchema = z.enum(["draft", "published", "archived"]);

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
  status: statusSchema.optional(),
  sortBy: z.string().default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export const postInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  status: statusSchema.default("draft"),
  featuredImageId: z.number().int().nullable().optional(),
});

export const pageInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  content: z.string().min(1),
  status: statusSchema.default("draft"),
});

export const settingsInputSchema = z.object({
  siteTitle: z.string().min(1),
  tagline: z.string().default(""),
  titleFormat: z.string().min(1),
  metaDescription: z.string().default(""),
  siteIconUrl: z.string().default(""),
  faviconUrl: z.string().default(""),
  language: z.string().min(1),
  timezone: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
