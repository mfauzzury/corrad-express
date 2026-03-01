#!/usr/bin/env node
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPairs = [
  ["apps/api-server/.env.example", "apps/api-server/.env"],
  ["apps/admin-web/.env.example", "apps/admin-web/.env"],
];

for (const [source, target] of envPairs) {
  const sourcePath = resolve(process.cwd(), source);
  const targetPath = resolve(process.cwd(), target);

  if (!existsSync(sourcePath)) {
    console.error(`missing required template: ${source}`);
    process.exitCode = 1;
    continue;
  }

  if (existsSync(targetPath)) {
    console.log(`kept existing ${target}`);
    continue;
  }

  copyFileSync(sourcePath, targetPath);
  console.log(`created ${target} from ${source}`);
}

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}

console.log("\nEnvironment files are ready.");
