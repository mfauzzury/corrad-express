<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  Gauge,
  FileText,
  Image,
  ArrowRight,
  TrendingUp,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import { fetchDashboardSummary } from "@/api/cms";
import type { Page, Post } from "@/types";

const router = useRouter();
const counts = ref({ posts: 0, pages: 0, media: 0 });
const recentPosts = ref<Post[]>([]);
const recentPages = ref<Page[]>([]);

onMounted(async () => {
  const response = await fetchDashboardSummary();
  counts.value = response.data.counts;
  recentPosts.value = response.data.recent.posts;
  recentPages.value = response.data.recent.pages;
});

function statusColor(status: string) {
  switch (status) {
    case "published":
      return "bg-emerald-100 text-emerald-700";
    case "draft":
      return "bg-amber-100 text-amber-700";
    case "archived":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">
      <!-- ───── Hero Header ───── -->
      <div class="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-5">
        <div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0); background-size: 24px 24px;" />
        <div class="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">Dashboard</h1>
            <p class="mt-1 text-slate-500">Overview of your CMS content and recent activity.</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-mono text-slate-500">
              /dashboard
            </div>
          </div>
        </div>
      </div>

      <!-- ───── Stat Cards ───── -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <FileText class="h-5 w-5 text-blue-600" />
            </div>
            <TrendingUp class="h-4 w-4 text-emerald-500" />
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ counts.posts }}</p>
          <p class="mt-0.5 text-sm text-slate-500">Total Posts</p>
        </div>
        <div class="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <FileText class="h-5 w-5 text-emerald-600" />
            </div>
            <TrendingUp class="h-4 w-4 text-emerald-500" />
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ counts.pages }}</p>
          <p class="mt-0.5 text-sm text-slate-500">Total Pages</p>
        </div>
        <div class="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Image class="h-5 w-5 text-amber-600" />
            </div>
            <TrendingUp class="h-4 w-4 text-emerald-500" />
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ counts.media }}</p>
          <p class="mt-0.5 text-sm text-slate-500">Media Files</p>
        </div>
      </div>

      <!-- ───── Recent Content ───── -->
      <div class="grid gap-6 md:grid-cols-2">
        <!-- Recent Posts -->
        <article class="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                <FileText class="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold">Recent Posts</h2>
                <p class="text-sm text-slate-500">Latest published and draft posts.</p>
              </div>
            </div>
            <button class="flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900" @click="router.push('/posts')">
              View all
              <ArrowRight class="h-3.5 w-3.5" />
            </button>
          </div>
          <div class="divide-y divide-slate-100">
            <div v-for="post in recentPosts" :key="post.id" class="flex items-center justify-between px-6 py-3 transition-colors hover:bg-slate-50">
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-slate-900">{{ post.title }}</p>
                <p class="text-xs text-slate-400">{{ post.slug }}</p>
              </div>
              <span class="ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusColor(post.status)">
                {{ post.status }}
              </span>
            </div>
            <div v-if="recentPosts.length === 0" class="px-6 py-8 text-center text-sm text-slate-400">
              No posts yet.
            </div>
          </div>
        </article>

        <!-- Recent Pages -->
        <article class="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                <FileText class="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold">Recent Pages</h2>
                <p class="text-sm text-slate-500">Latest published and draft pages.</p>
              </div>
            </div>
            <button class="flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900" @click="router.push('/pages')">
              View all
              <ArrowRight class="h-3.5 w-3.5" />
            </button>
          </div>
          <div class="divide-y divide-slate-100">
            <div v-for="page in recentPages" :key="page.id" class="flex items-center justify-between px-6 py-3 transition-colors hover:bg-slate-50">
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-slate-900">{{ page.title }}</p>
                <p class="text-xs text-slate-400">{{ page.slug }}</p>
              </div>
              <span class="ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusColor(page.status)">
                {{ page.status }}
              </span>
            </div>
            <div v-if="recentPages.length === 0" class="px-6 py-8 text-center text-sm text-slate-400">
              No pages yet.
            </div>
          </div>
        </article>
      </div>
    </div>
  </AdminLayout>
</template>
