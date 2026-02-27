<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  FileText,
  PenLine,
  Save,
  X,
  Type,
  Settings,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import { createPage, getPage, updatePage } from "@/api/cms";
import type { PublishStatus } from "@/types";

const route = useRoute();
const router = useRouter();

const id = computed(() => Number(route.params.id || 0));
const isEdit = computed(() => id.value > 0);

const title = ref("");
const slug = ref("");
const content = ref("");
const status = ref<PublishStatus>("draft");

async function load() {
  if (!isEdit.value) return;
  const response = await getPage(id.value);
  const page = response.data;
  title.value = page.title;
  slug.value = page.slug;
  content.value = page.content;
  status.value = page.status;
}

async function save() {
  const payload = {
    title: title.value,
    slug: slug.value || undefined,
    content: content.value,
    status: status.value,
  };

  if (isEdit.value) {
    await updatePage(id.value, payload);
  } else {
    await createPage(payload);
  }

  router.push("/pages");
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
            <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              {{ isEdit ? 'Edit Page' : 'Create Page' }}
            </h1>
            <p class="mt-1 text-slate-500">{{ isEdit ? 'Update your page content and settings.' : 'Create a new site page.' }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-mono text-slate-500">
              /pages/{{ isEdit ? id : 'new' }}
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════ CONTENT ═══════ -->
      <article class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
              <Type class="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold">Content</h2>
              <p class="text-sm text-slate-500">Page title, slug, and body content.</p>
            </div>
          </div>
        </div>
        <div class="space-y-4 p-6">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Title</label>
              <input v-model="title" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Enter page title" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Slug</label>
              <input v-model="slug" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="auto-generated-from-title" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Content</label>
            <textarea v-model="content" rows="12" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Write your page content here..." />
          </div>
        </div>
      </article>

      <!-- ═══════ SETTINGS ═══════ -->
      <article class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
              <Settings class="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold">Settings</h2>
              <p class="text-sm text-slate-500">Publishing status for this page.</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="max-w-sm space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Status</label>
            <select v-model="status" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </article>

      <!-- ═══════ ACTIONS ═══════ -->
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
          @click="save"
        >
          <Save class="h-4 w-4" />
          {{ isEdit ? 'Update Page' : 'Create Page' }}
        </button>
        <button
          class="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          @click="router.push('/pages')"
        >
          <X class="h-4 w-4" />
          Cancel
        </button>
      </div>
    </div>
  </AdminLayout>
</template>
