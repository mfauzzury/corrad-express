<script setup lang="ts">
import { computed, onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Bell,
  ChevronDown,
  FileText,
  Gauge,
  Image,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  Shield,
} from "lucide-vue-next";

import { useAuthStore } from "@/stores/auth";
import { useSiteStore } from "@/stores/site";
import { API_BASE_URL } from "@/env";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const site = useSiteStore();

function resolveUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

onMounted(() => {
  site.load();
});

type MenuItem = {
  label: string;
  to: string;
  icon: unknown;
  children?: Array<{ label: string; to: string }>;
  separatorAfter?: boolean;
};

const menu: MenuItem[] = [
  { label: "Dashboard", to: "/", icon: Gauge },
  {
    label: "Posts",
    to: "/posts",
    icon: FileText,
    children: [
      { label: "All Posts", to: "/posts" },
      { label: "Add New", to: "/posts/new" },
    ],
  },
  {
    label: "Pages",
    to: "/pages",
    icon: FileText,
    children: [
      { label: "All Pages", to: "/pages" },
      { label: "Add New", to: "/pages/new" },
    ],
  },
  {
    label: "Media",
    to: "/media",
    icon: Image,
    children: [{ label: "Library", to: "/media" }],
  },
  { label: "Menus", to: "/menus", icon: Menu, separatorAfter: true },
  {
    label: "Kitchen Sink",
    to: "/kitchen-sink",
    icon: LayoutGrid,
    children: [
      { label: "Components", to: "/kitchen-sink" },
      { label: "Forms", to: "/kitchen-sink/forms" },
      { label: "Charts", to: "/kitchen-sink/charts" },
    ],
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
    children: [
      { label: "General", to: "/settings" },
      { label: "Users", to: "/settings/users" },
      { label: "Roles", to: "/settings/roles" },
      { label: "System", to: "/settings/system" },
    ],
  },
];

const menuColors: Record<string, { bg: string; text: string; activeBg: string; activeBorder: string }> = {
  Dashboard: { bg: "bg-violet-100", text: "text-violet-600", activeBg: "bg-violet-50", activeBorder: "border-violet-200" },
  Posts: { bg: "bg-blue-100", text: "text-blue-600", activeBg: "bg-blue-50", activeBorder: "border-blue-200" },
  Pages: { bg: "bg-emerald-100", text: "text-emerald-600", activeBg: "bg-emerald-50", activeBorder: "border-emerald-200" },
  Media: { bg: "bg-amber-100", text: "text-amber-600", activeBg: "bg-amber-50", activeBorder: "border-amber-200" },
  Menus: { bg: "bg-teal-100", text: "text-teal-600", activeBg: "bg-teal-50", activeBorder: "border-teal-200" },
  "Kitchen Sink": { bg: "bg-pink-100", text: "text-pink-600", activeBg: "bg-pink-50", activeBorder: "border-pink-200" },
  Settings: { bg: "bg-slate-200", text: "text-slate-600", activeBg: "bg-slate-100", activeBorder: "border-slate-300" },
};

const openMenus = reactive<Record<string, boolean>>({
  Posts: false,
  Pages: false,
  Media: false,
  "Kitchen Sink": false,
  Settings: false,
});

const userInitials = computed(() => {
  if (!auth.user?.name) return "A";
  return auth.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

async function signOut() {
  await auth.signOut();
  router.push("/login");
}

function isActive(path: string): boolean {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
}

function itemClass(path: string) {
  if (isActive(path)) {
    return "bg-slate-100 font-semibold text-slate-900";
  }
  return "";
}

function childClass(path: string) {
  if (route.path === path) {
    return "bg-violet-50 font-medium text-violet-700 border border-violet-200";
  }
  return "text-slate-500 border border-transparent";
}

function toggleMenu(label: string) {
  openMenus[label] = !openMenus[label];
}

// Auto-open menu section when navigating to a child route
function syncOpenMenus() {
  for (const item of menu) {
    if (item.children && item.children.length > 0 && isActive(item.to)) {
      openMenus[item.label] = true;
    }
  }
}

watch(() => route.path, syncOpenMenus, { immediate: true });
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fb]">
    <!-- ───── Header ───── -->
    <header class="flex h-10 items-center justify-between border-b border-slate-200 bg-white px-5">
      <div class="flex items-center gap-2">
        <div v-if="site.siteIconUrl" class="flex h-6 shrink-0 items-center justify-center overflow-hidden">
          <img :src="resolveUrl(site.siteIconUrl)" alt="Site icon" class="h-full w-auto object-contain" />
        </div>
        <div v-else class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-indigo-600">
          <Shield class="h-3.5 w-3.5 text-white" />
        </div>
        <span v-if="site.siteTitle" class="text-sm font-semibold text-slate-900">{{ site.siteTitle }}</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="group relative flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
          title="Notifications"
        >
          <Bell class="h-4 w-4" />
          <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          <span class="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Notifications</span>
        </button>
        <button
          class="group relative flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-rose-600"
          title="Logout"
          @click="signOut"
        >
          <LogOut class="h-4 w-4" />
          <span class="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Logout</span>
        </button>
      </div>
    </header>

    <div class="flex min-h-[calc(100vh-40px)] flex-col md:flex-row">
      <!-- ───── Sidebar ───── -->
      <aside class="flex w-full flex-col border-r border-slate-200 bg-slate-50/50 md:w-64">
        <!-- Navigation -->
        <nav class="flex-1 space-y-0.5 overflow-y-auto p-3">
          <div v-for="item in menu" :key="item.label">
            <!-- Parent with children -->
            <button
              v-if="item.children && item.children.length > 0"
              type="button"
              class="group flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-sm font-medium text-slate-700 transition-all hover:bg-white hover:shadow-sm"
              :class="itemClass(item.to)"
              @click="toggleMenu(item.label)"
            >
              <component
                :is="item.icon"
                class="h-4 w-4 shrink-0 transition-colors"
                :class="isActive(item.to) ? 'text-slate-700' : 'text-slate-400 group-hover:text-slate-600'"
              />
              <span class="flex-1">{{ item.label }}</span>
              <ChevronDown
                class="h-4 w-4 text-slate-400 transition-transform duration-200"
                :class="{ '-rotate-90': !openMenus[item.label] }"
              />
            </button>

            <!-- Parent without children -->
            <router-link
              v-else
              :to="item.to"
              class="group flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-all hover:bg-white hover:shadow-sm"
              :class="itemClass(item.to)"
            >
              <component
                :is="item.icon"
                class="h-4 w-4 shrink-0 transition-colors"
                :class="isActive(item.to) ? 'text-slate-700' : 'text-slate-400 group-hover:text-slate-600'"
              />
              <span class="flex-1">{{ item.label }}</span>
            </router-link>

            <!-- Children submenu -->
            <div
              v-if="item.children && item.children.length > 0 && openMenus[item.label]"
              class="ml-5 mt-1 space-y-0.5 border-l-2 border-slate-200 pl-4"
            >
              <router-link
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="block rounded-md px-3 py-1 text-sm transition-all hover:bg-white hover:shadow-sm"
                :class="childClass(child.to)"
              >
                {{ child.label }}
              </router-link>
            </div>

            <!-- Separator -->
            <div v-if="item.separatorAfter" class="my-2 border-t border-slate-200" />
          </div>
        </nav>

        <!-- Sidebar Footer -->
        <div class="border-t border-slate-200 p-3">
          <div class="flex items-center gap-3 rounded-lg bg-white p-2.5 shadow-sm">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-semibold text-white">
              {{ userInitials }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-slate-900">{{ auth.user?.name || 'Admin' }}</p>
              <p class="truncate text-xs text-slate-500">{{ auth.user?.email || '' }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- ───── Main Content ───── -->
      <main class="w-full min-w-0 flex-1 bg-white p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
