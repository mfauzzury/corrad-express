<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Settings,
  Globe,
  Image,
  Search,
  Save,
  CheckCircle2,
  Upload,
  Trash2,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import { getSettings, updateSettings, uploadMedia } from "@/api/cms";
import { API_BASE_URL } from "@/env";
import { useSiteStore } from "@/stores/site";
import { useRoute } from "vue-router";
import type { SettingsPayload } from "@/types";

const site = useSiteStore();
const route = useRoute();

const form = ref<SettingsPayload>({
  siteTitle: "",
  tagline: "",
  titleFormat: "%page% | %site%",
  metaDescription: "",
  siteIconUrl: "",
  faviconUrl: "",
  language: "en",
  timezone: "UTC",
  footerText: "",
});

const saved = ref(false);
const saving = ref(false);
const error = ref("");
const uploadingSiteIcon = ref(false);
const uploadingFavicon = ref(false);

function resolveUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

async function onSiteIconUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  uploadingSiteIcon.value = true;
  error.value = "";
  try {
    const res = await uploadMedia(file);
    form.value.siteIconUrl = res.data.url;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Failed to upload site icon";
  } finally {
    uploadingSiteIcon.value = false;
    (event.target as HTMLInputElement).value = "";
  }
}

async function onFaviconUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  uploadingFavicon.value = true;
  error.value = "";
  try {
    const res = await uploadMedia(file);
    form.value.faviconUrl = res.data.url;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Failed to upload favicon";
  } finally {
    uploadingFavicon.value = false;
    (event.target as HTMLInputElement).value = "";
  }
}

async function load() {
  try {
    const response = await getSettings();
    form.value = response.data;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Failed to load settings";
  }
}

async function save() {
  saving.value = true;
  error.value = "";
  try {
    await updateSettings(form.value);
    site.applyFrom(form.value);
    site.setDocumentTitle((route.meta.title as string) || "Settings");
    saved.value = true;
    setTimeout(() => {
      saved.value = false;
    }, 2000);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Failed to save settings";
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-4">
      <!-- ───── Hero Header ───── -->
      <div class="flex items-center justify-between">
        <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-[1.45rem] font-bold tracking-tight text-transparent">Settings</h1>
      </div>

      <div class="space-y-4">
        <!-- ═══════ GENERAL ═══════ -->
        <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <Globe class="h-4 w-4 text-violet-600" />
            <h2 class="text-sm font-semibold text-slate-900">General</h2>
          </div>
          <div class="p-4">
            <div class="grid gap-3 md:grid-cols-2">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">Site Title</label>
                <input v-model="form.siteTitle" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">Tagline</label>
                <input v-model="form.tagline" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">Language</label>
                <input v-model="form.language" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">Timezone</label>
                <input v-model="form.timezone" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" />
              </div>
              <div class="space-y-1.5 md:col-span-2">
                <label class="text-sm font-medium text-slate-700">Footer Text</label>
                <input v-model="form.footerText" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="e.g. © 2026 My Company" />
                <p class="text-xs text-slate-400">Displayed at the bottom of the sidebar.</p>
              </div>
            </div>
          </div>
        </article>

        <!-- ═══════ SEO ═══════ -->
        <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <Search class="h-4 w-4 text-blue-600" />
            <h2 class="text-sm font-semibold text-slate-900">SEO</h2>
          </div>
          <div class="p-4">
            <div class="grid gap-3 md:grid-cols-2">
              <div class="space-y-1.5 md:col-span-2">
                <label class="text-sm font-medium text-slate-700">Title Format</label>
                <input v-model="form.titleFormat" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                <p class="text-xs text-slate-400">Use <code class="rounded bg-slate-100 px-1 py-0.5 text-xs">%page%</code> and <code class="rounded bg-slate-100 px-1 py-0.5 text-xs">%site%</code> as placeholders.</p>
              </div>
              <div class="space-y-1.5 md:col-span-2">
                <label class="text-sm font-medium text-slate-700">Meta Description</label>
                <textarea v-model="form.metaDescription" rows="3" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" />
              </div>
            </div>
          </div>
        </article>

        <!-- ═══════ BRANDING ═══════ -->
        <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <Image class="h-4 w-4 text-amber-600" />
            <h2 class="text-sm font-semibold text-slate-900">Branding</h2>
          </div>
          <div class="p-4">
            <div class="grid gap-3 md:grid-cols-2">
              <!-- Site Icon -->
              <div class="space-y-3">
                <label class="text-sm font-medium text-slate-700">Site Icon</label>
                <div class="flex items-start gap-4">
                  <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
                    <img v-if="form.siteIconUrl" :src="resolveUrl(form.siteIconUrl)" alt="Site icon" class="h-full w-full object-contain" />
                    <Image v-else class="h-8 w-8 text-slate-300" />
                  </div>
                  <div class="flex-1 space-y-2">
                    <label class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                      <Upload class="h-4 w-4" />
                      {{ uploadingSiteIcon ? 'Uploading...' : 'Upload Icon' }}
                      <input type="file" accept="image/*" class="hidden" @change="onSiteIconUpload" :disabled="uploadingSiteIcon" />
                    </label>
                    <button v-if="form.siteIconUrl" class="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-rose-500" @click="form.siteIconUrl = ''">
                      <Trash2 class="h-3 w-3" />
                      Remove
                    </button>
                    <p class="text-xs text-slate-400">Recommended: 512x512px PNG</p>
                  </div>
                </div>
              </div>

              <!-- Favicon -->
              <div class="space-y-3">
                <label class="text-sm font-medium text-slate-700">Favicon</label>
                <div class="flex items-start gap-4">
                  <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
                    <img v-if="form.faviconUrl" :src="resolveUrl(form.faviconUrl)" alt="Favicon" class="h-full w-full object-contain" />
                    <Image v-else class="h-8 w-8 text-slate-300" />
                  </div>
                  <div class="flex-1 space-y-2">
                    <label class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                      <Upload class="h-4 w-4" />
                      {{ uploadingFavicon ? 'Uploading...' : 'Upload Favicon' }}
                      <input type="file" accept="image/*,.ico" class="hidden" @change="onFaviconUpload" :disabled="uploadingFavicon" />
                    </label>
                    <button v-if="form.faviconUrl" class="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-rose-500" @click="form.faviconUrl = ''">
                      <Trash2 class="h-3 w-3" />
                      Remove
                    </button>
                    <p class="text-xs text-slate-400">Recommended: 32x32px ICO or PNG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- ═══════ ACTIONS ═══════ -->
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <button
              class="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50"
              :disabled="saving"
              @click="save"
            >
              <Save class="h-4 w-4" />
              {{ saving ? 'Saving...' : 'Save Settings' }}
            </button>
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <span v-if="saved" class="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <CheckCircle2 class="h-4 w-4" />
                Saved
              </span>
            </Transition>
          </div>
          <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
