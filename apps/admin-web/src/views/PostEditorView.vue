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
  Image,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import { createPost, getPost, listMedia, updatePost } from "@/api/cms";
import type { Media, PublishStatus } from "@/types";

const route = useRoute();
const router = useRouter();

const id = computed(() => Number(route.params.id || 0));
const isEdit = computed(() => id.value > 0);

const title = ref("");
const slug = ref("");
const excerpt = ref("");
const content = ref("");
const status = ref<PublishStatus>("draft");
const featuredImageId = ref<number | null>(null);
const mediaItems = ref<Media[]>([]);

async function loadMedia() {
  const response = await listMedia();
  mediaItems.value = response.data;
}

async function load() {
  await loadMedia();
  if (!isEdit.value) return;
  const response = await getPost(id.value);
  const post = response.data;
  title.value = post.title;
  slug.value = post.slug;
  excerpt.value = post.excerpt || "";
  content.value = post.content;
  status.value = post.status;
  featuredImageId.value = post.featuredImageId ?? null;
}

async function save() {
  const payload = {
    title: title.value,
    slug: slug.value || undefined,
    excerpt: excerpt.value || undefined,
    content: content.value,
    status: status.value,
    featuredImageId: featuredImageId.value,
  };

  if (isEdit.value) {
    await updatePost(id.value, payload);
  } else {
    await createPost(payload);
  }

  router.push("/posts");
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
              {{ isEdit ? 'Edit Post' : 'Create Post' }}
            </h1>
            <p class="mt-1 text-slate-500">{{ isEdit ? 'Update your post content and settings.' : 'Write and publish a new blog post.' }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-mono text-slate-500">
              /posts/{{ isEdit ? id : 'new' }}
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════ CONTENT ═══════ -->
      <article class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
              <Type class="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold">Content</h2>
              <p class="text-sm text-slate-500">Post title, slug, and body content.</p>
            </div>
          </div>
        </div>
        <div class="space-y-4 p-6">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Title</label>
              <input v-model="title" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Enter post title" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Slug</label>
              <input v-model="slug" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="auto-generated-from-title" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Excerpt</label>
            <textarea v-model="excerpt" rows="2" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Brief summary of the post..." />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Content</label>
            <textarea v-model="content" rows="10" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Write your post content here..." />
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
              <p class="text-sm text-slate-500">Publishing status and featured image.</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Status</label>
              <select v-model="status" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Featured Image</label>
              <select v-model.number="featuredImageId" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200">
                <option :value="null">None</option>
                <option v-for="m in mediaItems" :key="m.id" :value="m.id">{{ m.originalName }}</option>
              </select>
            </div>
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
          {{ isEdit ? 'Update Post' : 'Create Post' }}
        </button>
        <button
          class="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          @click="router.push('/posts')"
        >
          <X class="h-4 w-4" />
          Cancel
        </button>
      </div>
    </div>
  </AdminLayout>
</template>
