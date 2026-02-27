<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  Image,
  Upload,
  Trash2,
  AlertCircle,
  FolderOpen,
} from "lucide-vue-next";

import { API_BASE_URL } from "@/env";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { listMedia, removeMedia, uploadMedia } from "@/api/cms";
import type { Media } from "@/types";

const rows = ref<Media[]>([]);
const error = ref("");
const uploading = ref(false);

async function load() {
  const response = await listMedia();
  rows.value = response.data;
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  error.value = "";
  uploading.value = true;
  try {
    await uploadMedia(file);
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Upload failed";
  } finally {
    uploading.value = false;
    target.value = "";
  }
}

async function remove(id: number) {
  error.value = "";
  try {
    await removeMedia(id);
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Delete failed";
  }
}

const withBase = computed(() => (path: string) => `${API_BASE_URL}${path}`);

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
            <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">Media Library</h1>
            <p class="mt-1 text-slate-500">Upload, browse, and manage your media assets.</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-mono text-slate-500">
              /media
            </div>
          </div>
        </div>
      </div>

      <!-- ───── Upload Area ───── -->
      <article class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
              <Upload class="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold">Upload</h2>
              <p class="text-sm text-slate-500">Add new files to your media library.</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <label class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition-colors hover:border-violet-400 hover:bg-violet-50/30">
            <Upload class="mb-3 h-8 w-8 text-slate-400" />
            <p class="text-sm font-medium text-slate-700">Click to upload a file</p>
            <p class="mt-1 text-xs text-slate-400">PNG, JPG, GIF, SVG, PDF up to 10MB</p>
            <input type="file" class="hidden" @change="onFileChange" />
          </label>
          <p v-if="uploading" class="mt-3 text-sm text-violet-600">Uploading...</p>
          <div v-if="error" class="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
            <AlertCircle class="h-4 w-4 shrink-0" />
            {{ error }}
          </div>
        </div>
      </article>

      <!-- ───── Media Grid ───── -->
      <article class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
              <FolderOpen class="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold">Library</h2>
              <p class="text-sm text-slate-500">{{ rows.length }} file{{ rows.length !== 1 ? 's' : '' }} in your library.</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div v-if="rows.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="item in rows"
              :key="item.id"
              class="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div class="relative aspect-video bg-slate-100">
                <img
                  :src="withBase(item.url)"
                  :alt="item.originalName"
                  class="h-full w-full object-cover"
                />
                <button
                  class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-400 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                  @click="remove(item.id)"
                  title="Delete"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
              <div class="px-3 py-2.5">
                <p class="truncate text-sm font-medium text-slate-900">{{ item.originalName }}</p>
                <p class="text-xs text-slate-400">{{ item.mimeType }}</p>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12 text-center">
            <Image class="mb-3 h-10 w-10 text-slate-300" />
            <p class="text-sm font-medium text-slate-500">No media files yet</p>
            <p class="mt-1 text-xs text-slate-400">Upload your first file to get started.</p>
          </div>
        </div>
      </article>
    </div>
  </AdminLayout>
</template>
