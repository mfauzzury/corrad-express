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
  categoryIds: z.array(z.number().int()).optional(),
});

export const pageInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  content: z.string().min(1),
  status: statusSchema.default("draft"),
  featuredImageId: z.number().int().nullable().optional(),
});

export const settingsInputSchema = z.object({
  siteTitle: z.string().min(1),
  tagline: z.string().default(""),
  titleFormat: z.string().min(1),
  metaDescription: z.string().default(""),
  siteIconUrl: z.string().default(""),
  sidebarLogoUrl: z.string().default(""),
  faviconUrl: z.string().default(""),
  language: z.string().min(1),
  timezone: z.string().min(1),
  footerText: z.string().default(""),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const categoryInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export const userInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const roleInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),
  permissions: z.array(z.string()).default([]),
});

export const adminMenuPrefsSchema = z.object({
  groupOrder: z.array(z.string()),
  itemOrder: z.record(z.string(), z.array(z.string())),
  hidden: z.array(z.string()),
  hiddenGroups: z.array(z.string()).default([]),
});

export const mediaMetadataInputSchema = z.object({
  title: z.string().trim().max(255).default(""),
  altText: z.string().trim().max(255).default(""),
  caption: z.string().trim().max(1000).default(""),
  description: z.string().trim().max(5000).default(""),
});
