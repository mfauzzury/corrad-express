<script setup lang="ts">
import {
  Cpu,
  Database,
  Globe,
  Layers,
  Monitor,
  Palette,
  Server,
  Shield,
  Package,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";

type StackItem = { name: string; version: string; description?: string };
type StackGroup = { label: string; icon: unknown; color: { bg: string; text: string }; items: StackItem[] };

const stack: StackGroup[] = [
  {
    label: "Frontend",
    icon: Monitor,
    color: { bg: "bg-violet-100", text: "text-violet-600" },
    items: [
      { name: "Vue", version: "3.5", description: "Progressive JavaScript framework" },
      { name: "TypeScript", version: "5.9", description: "Typed superset of JavaScript" },
      { name: "Vite", version: "7.1", description: "Next-gen frontend build tool" },
      { name: "Vue Router", version: "4.5", description: "Official router for Vue.js" },
      { name: "Pinia", version: "3.0", description: "Intuitive Vue store" },
    ],
  },
  {
    label: "Styling & UI",
    icon: Palette,
    color: { bg: "bg-pink-100", text: "text-pink-600" },
    items: [
      { name: "Tailwind CSS", version: "3.4", description: "Utility-first CSS framework" },
      { name: "PostCSS", version: "8.5", description: "CSS post-processor" },
      { name: "Lucide Icons", version: "0.542", description: "Beautiful consistent icons" },
    ],
  },
  {
    label: "Backend",
    icon: Server,
    color: { bg: "bg-blue-100", text: "text-blue-600" },
    items: [
      { name: "Express", version: "5.1", description: "Fast, minimalist web framework" },
      { name: "Node.js", version: "ES2022", description: "JavaScript runtime" },
      { name: "TypeScript", version: "5.9", description: "Typed superset of JavaScript" },
      { name: "Zod", version: "4.1", description: "TypeScript-first schema validation" },
    ],
  },
  {
    label: "Database & ORM",
    icon: Database,
    color: { bg: "bg-emerald-100", text: "text-emerald-600" },
    items: [
      { name: "Prisma", version: "6.5", description: "Next-generation Node.js ORM" },
      { name: "SQLite", version: "3", description: "Lightweight file-based database" },
    ],
  },
  {
    label: "Authentication & Security",
    icon: Shield,
    color: { bg: "bg-amber-100", text: "text-amber-600" },
    items: [
      { name: "bcryptjs", version: "3.0", description: "Password hashing" },
      { name: "CSRF Protection", version: "---", description: "Token-based CSRF prevention" },
      { name: "express-rate-limit", version: "8.1", description: "Rate limiting middleware" },
      { name: "cookie-parser", version: "1.4", description: "Session cookie handling" },
    ],
  },
  {
    label: "Infrastructure",
    icon: Layers,
    color: { bg: "bg-teal-100", text: "text-teal-600" },
    items: [
      { name: "npm Workspaces", version: "---", description: "Monorepo package management" },
      { name: "Multer", version: "2.0", description: "File upload handling" },
      { name: "CORS", version: "2.8", description: "Cross-origin resource sharing" },
      { name: "dotenv", version: "17.2", description: "Environment variable management" },
    ],
  },
];
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-4">
      <!-- ───── Hero Header ───── -->
      <div class="flex items-center justify-between">
        <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-[1.45rem] font-bold tracking-tight text-transparent">System Information</h1>
      </div>

      <!-- ───── Architecture Overview ───── -->
      <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <Cpu class="h-4 w-4 text-slate-600" />
          <h2 class="text-sm font-semibold text-slate-900">Architecture</h2>
        </div>
        <div class="p-4">
          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-lg border border-slate-200 p-3">
              <div class="flex items-center gap-2">
                <Globe class="h-4 w-4 text-violet-500" />
                <p class="text-sm font-semibold text-slate-900">Frontend SPA</p>
              </div>
              <p class="mt-1.5 text-xs text-slate-500">Vue 3 single-page application with Composition API, built with Vite and served on port 5173.</p>
            </div>
            <div class="rounded-lg border border-slate-200 p-3">
              <div class="flex items-center gap-2">
                <Server class="h-4 w-4 text-blue-500" />
                <p class="text-sm font-semibold text-slate-900">REST API</p>
              </div>
              <p class="mt-1.5 text-xs text-slate-500">Express 5 backend with Prisma ORM, session-based auth, and CSRF protection on port 4000.</p>
            </div>
            <div class="rounded-lg border border-slate-200 p-3">
              <div class="flex items-center gap-2">
                <Package class="h-4 w-4 text-teal-500" />
                <p class="text-sm font-semibold text-slate-900">Monorepo</p>
              </div>
              <p class="mt-1.5 text-xs text-slate-500">npm workspaces managing multiple apps: admin frontend, API server, and reference UI.</p>
            </div>
          </div>
        </div>
      </article>

      <!-- ───── Stack Groups ───── -->
      <div class="grid gap-4 lg:grid-cols-2">
        <article v-for="group in stack" :key="group.label" class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <component :is="group.icon" class="h-4 w-4" :class="group.color.text" />
            <h2 class="text-sm font-semibold text-slate-900">{{ group.label }}</h2>
          </div>
          <div class="divide-y divide-slate-100">
            <div v-for="item in group.items" :key="item.name" class="flex items-center justify-between px-4 py-2">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-slate-900">{{ item.name }}</p>
                <p v-if="item.description" class="text-xs text-slate-400">{{ item.description }}</p>
              </div>
              <span class="ml-3 shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-mono text-slate-600">{{ item.version }}</span>
            </div>
          </div>
        </article>
      </div>

      <!-- ───── Database Schema ───── -->
      <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <Database class="h-4 w-4 text-emerald-600" />
          <h2 class="text-sm font-semibold text-slate-900">Database Models</h2>
        </div>
        <div class="p-4">
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="model in [
              { name: 'User', desc: 'Admin users with roles and credentials' },
              { name: 'Session', desc: 'Authentication sessions with expiry' },
              { name: 'Post', desc: 'Blog posts with draft/published/archived states' },
              { name: 'Page', desc: 'Static pages with publish workflow' },
              { name: 'Media', desc: 'Uploaded files with image metadata' },
              { name: 'Setting', desc: 'Key-value site configuration pairs' },
            ]" :key="model.name" class="rounded-lg border border-slate-200 px-3 py-2">
              <p class="text-sm font-medium text-slate-900">{{ model.name }}</p>
              <p class="mt-0.5 text-xs text-slate-400">{{ model.desc }}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </AdminLayout>
</template>
