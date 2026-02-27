<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import { deletePage, listPages } from "@/api/cms";
import type { Page } from "@/types";

const router = useRouter();
const rows = ref<Page[]>([]);

async function load() {
  const response = await listPages("?page=1&limit=20");
  rows.value = response.data;
}

async function remove(id: number) {
  await deletePage(id);
  await load();
}

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

onMounted(load);
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">
      <!-- ───── Hero Header ───── -->
      <div class="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-5">
        <div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0); background-size: 24px 24px;" />
        <div class="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">Pages</h1>
            <p class="mt-1 text-slate-500">Create, edit, and manage your site pages.</p>
          </div>
          <button
            class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
            @click="router.push('/pages/new')"
          >
            <Plus class="h-4 w-4" />
            Add Page
          </button>
        </div>
      </div>

      <!-- ───── Table Card ───── -->
      <article class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
              <FileText class="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold">All Pages</h2>
              <p class="text-sm text-slate-500">{{ rows.length }} page{{ rows.length !== 1 ? 's' : '' }} found.</p>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-left">
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</th>
                <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in rows" :key="item.id" class="transition-colors hover:bg-slate-50">
                <td class="px-6 py-3 font-medium text-slate-900">{{ item.title }}</td>
                <td class="px-6 py-3">
                  <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusColor(item.status)">{{ item.status }}</span>
                </td>
                <td class="px-6 py-3 font-mono text-xs text-slate-500">{{ item.slug }}</td>
                <td class="px-6 py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      @click="router.push(`/pages/${item.id}`)"
                      title="Edit"
                    >
                      <Pencil class="h-3.5 w-3.5" />
                    </button>
                    <button
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      @click="remove(item.id)"
                      title="Delete"
                    >
                      <Trash2 class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="rows.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-sm text-slate-400">No pages found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </AdminLayout>
</template>
