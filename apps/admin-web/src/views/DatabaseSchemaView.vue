<script setup lang="ts">
import { Database, KeyRound, Link2 } from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";

type Field = { name: string; type: string; note?: string };
type ModelDef = { name: string; description: string; fields: Field[] };

const models: ModelDef[] = [
  {
    name: "User",
    description: "Admin users with authentication and profile data.",
    fields: [
      { name: "id", type: "Int", note: "PK" },
      { name: "email", type: "String", note: "Unique" },
      { name: "passwordHash", type: "String" },
      { name: "name", type: "String" },
      { name: "role", type: "String" },
      { name: "isActive", type: "Boolean" },
      { name: "createdAt", type: "DateTime" },
    ],
  },
  {
    name: "Session",
    description: "User login sessions and expiry tracking.",
    fields: [
      { name: "id", type: "Int", note: "PK" },
      { name: "userId", type: "Int", note: "FK -> User.id" },
      { name: "tokenHash", type: "String", note: "Unique" },
      { name: "expiresAt", type: "DateTime" },
      { name: "createdAt", type: "DateTime" },
    ],
  },
  {
    name: "Post",
    description: "Content posts with statuses and featured media.",
    fields: [
      { name: "id", type: "Int", note: "PK" },
      { name: "title", type: "String" },
      { name: "slug", type: "String", note: "Unique" },
      { name: "content", type: "String" },
      { name: "status", type: "PublishStatus" },
      { name: "featuredImageId", type: "Int?", note: "FK -> Media.id" },
      { name: "publishedAt", type: "DateTime?" },
    ],
  },
  {
    name: "Page",
    description: "Static pages with publish workflow.",
    fields: [
      { name: "id", type: "Int", note: "PK" },
      { name: "title", type: "String" },
      { name: "slug", type: "String", note: "Unique" },
      { name: "content", type: "String" },
      { name: "status", type: "PublishStatus" },
      { name: "featuredImageId", type: "Int?", note: "FK -> Media.id" },
    ],
  },
  {
    name: "Media",
    description: "Uploaded assets and attachment metadata.",
    fields: [
      { name: "id", type: "Int", note: "PK" },
      { name: "filename", type: "String" },
      { name: "originalName", type: "String" },
      { name: "title", type: "String?" },
      { name: "altText", type: "String?" },
      { name: "caption", type: "String?" },
      { name: "description", type: "String?" },
      { name: "url", type: "String" },
    ],
  },
  {
    name: "Setting",
    description: "Key-value settings used by CMS and admin UI.",
    fields: [
      { name: "key", type: "String", note: "PK" },
      { name: "value", type: "String" },
      { name: "updatedAt", type: "DateTime" },
    ],
  },
];
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="page-title">Database Schema</h1>
      </div>

      <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <Database class="h-4 w-4 text-emerald-600" />
          <h2 class="text-sm font-semibold text-slate-900">Prisma Models</h2>
        </div>
        <div class="p-4">
          <div class="grid gap-4 lg:grid-cols-2">
            <article v-for="model in models" :key="model.name" class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-100 px-4 py-2.5">
                <p class="text-sm font-semibold text-slate-900">{{ model.name }}</p>
                <p class="mt-0.5 text-xs text-slate-500">{{ model.description }}</p>
              </div>
              <div class="divide-y divide-slate-100">
                <div v-for="field in model.fields" :key="field.name" class="flex items-center justify-between gap-3 px-4 py-2">
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-slate-900">{{ field.name }}</p>
                    <p v-if="field.note" class="text-xs text-slate-400">{{ field.note }}</p>
                  </div>
                  <span class="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-mono text-slate-600">{{ field.type }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </article>

      <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <Link2 class="h-4 w-4 text-blue-600" />
          <h2 class="text-sm font-semibold text-slate-900">Relationship Notes</h2>
        </div>
        <div class="space-y-2 p-4 text-sm text-slate-600">
          <p><KeyRound class="mr-1 inline h-3.5 w-3.5 text-amber-600" /> `Post.featuredImageId` and `Page.featuredImageId` reference `Media.id`.</p>
          <p><KeyRound class="mr-1 inline h-3.5 w-3.5 text-amber-600" /> `Session.userId` references `User.id` with cascade delete.</p>
          <p><KeyRound class="mr-1 inline h-3.5 w-3.5 text-amber-600" /> `Setting` uses `key` as primary identifier for fast config lookup.</p>
        </div>
      </article>
    </div>
  </AdminLayout>
</template>
