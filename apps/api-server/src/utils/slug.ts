import { prisma } from "../prisma.js";

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function uniquePostSlug(baseTitle: string, requestedSlug?: string, excludeId?: number) {
  const base = toSlug(requestedSlug || baseTitle) || "post";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
    if (!existing) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}

export async function uniquePageSlug(baseTitle: string, requestedSlug?: string, excludeId?: number) {
  const base = toSlug(requestedSlug || baseTitle) || "page";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.page.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
    if (!existing) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}

export async function uniqueCategorySlug(baseName: string, requestedSlug?: string, excludeId?: number) {
  const base = toSlug(requestedSlug || baseName) || "category";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.category.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
    if (!existing) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}
