-- Add WordPress-style attachment metadata fields
ALTER TABLE "Media" ADD COLUMN "title" TEXT;
ALTER TABLE "Media" ADD COLUMN "caption" TEXT;
ALTER TABLE "Media" ADD COLUMN "description" TEXT;
