#!/usr/bin/env node
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const removeData = process.argv.includes("--all");

const baseTargets = [
  ".next",
  "node_modules",
  "apps/admin-web/node_modules",
  "apps/admin-web/dist",
  "apps/admin-web/tsconfig.app.tsbuildinfo",
  "apps/api-server/dist",
  "apps/api-server/node_modules",
  "apps/api-server/prisma/dev.db-journal",
  ".claude",
];

const dataTargets = [
  "apps/api-server/prisma/dev.db",
  "apps/api-server/uploads",
  "apps/admin-web/.env",
  "apps/api-server/.env",
];

const targets = removeData ? [...baseTargets, ...dataTargets] : baseTargets;

for (const relativePath of targets) {
  const fullPath = resolve(process.cwd(), relativePath);
  if (!existsSync(fullPath)) continue;

  rmSync(fullPath, { recursive: true, force: true });
  console.log(`removed ${relativePath}`);
}

if (!removeData) {
  console.log("\nKept local data (.env, SQLite DB, uploads). Use --all to remove them.");
}
