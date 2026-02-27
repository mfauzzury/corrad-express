<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  Menu,
  Plus,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Save,
  X,
  GripVertical,
  Gauge,
  FileText,
  Image,
  LayoutGrid,
  Settings,
  Users,
  Globe,
  Folder,
  Tag,
  MessageSquare,
  Bell,
  Calendar,
  BarChart3,
  Shield,
  PenLine,
  Home,
  Link,
  Star,
  Heart,
  Bookmark,
  Search,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import {
  listMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} from "@/api/cms";
import type { AdminMenuItem, AdminMenuItemInput } from "@/types";

const items = ref<AdminMenuItem[]>([]);
const selectedId = ref<number | null>(null);
const isNew = ref(false);
const saving = ref(false);

const form = ref<AdminMenuItemInput>({
  label: "",
  url: "",
  icon: "FileText",
  parentId: null,
  order: 0,
  isVisible: true,
});

const iconOptions = [
  { name: "Gauge", component: Gauge },
  { name: "FileText", component: FileText },
  { name: "Image", component: Image },
  { name: "LayoutGrid", component: LayoutGrid },
  { name: "Settings", component: Settings },
  { name: "Menu", component: Menu },
  { name: "Users", component: Users },
  { name: "Globe", component: Globe },
  { name: "Folder", component: Folder },
  { name: "Tag", component: Tag },
  { name: "MessageSquare", component: MessageSquare },
  { name: "Bell", component: Bell },
  { name: "Calendar", component: Calendar },
  { name: "BarChart3", component: BarChart3 },
  { name: "Shield", component: Shield },
  { name: "PenLine", component: PenLine },
  { name: "Home", component: Home },
  { name: "Link", component: Link },
  { name: "Star", component: Star },
  { name: "Heart", component: Heart },
  { name: "Bookmark", component: Bookmark },
  { name: "Search", component: Search },
];

const iconMap = computed(() => {
  const map: Record<string, unknown> = {};
  for (const opt of iconOptions) {
    map[opt.name] = opt.component;
  }
  return map;
});

const topLevelItems = computed(() =>
  items.value.filter((i) => i.parentId === null).sort((a, b) => a.order - b.order),
);

const childrenOf = computed(() => {
  const map: Record<number, AdminMenuItem[]> = {};
  for (const item of items.value) {
    if (item.parentId !== null) {
      if (!map[item.parentId]) map[item.parentId] = [];
      map[item.parentId].push(item);
    }
  }
  for (const key of Object.keys(map)) {
    map[Number(key)].sort((a, b) => a.order - b.order);
  }
  return map;
});

const parentOptions = computed(() =>
  items.value
    .filter((i) => i.parentId === null && i.id !== selectedId.value)
    .sort((a, b) => a.order - b.order),
);

async function load() {
  const response = await listMenuItems();
  items.value = response.data;
}

function selectItem(item: AdminMenuItem) {
  selectedId.value = item.id;
  isNew.value = false;
  form.value = {
    label: item.label,
    url: item.url,
    icon: item.icon,
    parentId: item.parentId,
    order: item.order,
    isVisible: item.isVisible,
  };
}

function startNew() {
  selectedId.value = null;
  isNew.value = true;
  const maxOrder = items.value.reduce((max, i) => Math.max(max, i.order), 0);
  form.value = {
    label: "",
    url: "",
    icon: "FileText",
    parentId: null,
    order: maxOrder + 1,
    isVisible: true,
  };
}

function cancelEdit() {
  selectedId.value = null;
  isNew.value = false;
}

async function save() {
  saving.value = true;
  try {
    if (isNew.value) {
      await createMenuItem(form.value);
    } else if (selectedId.value !== null) {
      await updateMenuItem(selectedId.value, form.value);
    }
    await load();
    selectedId.value = null;
    isNew.value = false;
  } finally {
    saving.value = false;
  }
}

async function remove() {
  if (selectedId.value === null) return;
  await deleteMenuItem(selectedId.value);
  await load();
  selectedId.value = null;
  isNew.value = false;
}

async function moveItem(item: AdminMenuItem, direction: "up" | "down") {
  const siblings = item.parentId === null
    ? topLevelItems.value
    : (childrenOf.value[item.parentId] || []);
  const idx = siblings.findIndex((s) => s.id === item.id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return;

  const updates = [
    { id: item.id, order: siblings[swapIdx].order },
    { id: siblings[swapIdx].id, order: item.order },
  ];
  await reorderMenuItems(updates);
  await load();
}

async function toggleVisibility(item: AdminMenuItem) {
  await updateMenuItem(item.id, {
    label: item.label,
    url: item.url,
    icon: item.icon,
    parentId: item.parentId,
    order: item.order,
    isVisible: !item.isVisible,
  });
  await load();
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
            <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">Menus</h1>
            <p class="mt-1 text-slate-500">Manage your admin sidebar navigation items.</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-mono text-slate-500">
              /menus
            </div>
          </div>
        </div>
      </div>

      <!-- ───── Content Grid ───── -->
      <div class="grid gap-6 lg:grid-cols-5">
        <!-- ═══════ LEFT: Menu Items List ═══════ -->
        <article class="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100">
                <Menu class="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold">Menu Items</h2>
                <p class="text-sm text-slate-500">{{ items.length }} item{{ items.length !== 1 ? 's' : '' }} configured.</p>
              </div>
            </div>
            <button
              class="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
              @click="startNew"
            >
              <Plus class="h-4 w-4" />
              Add Item
            </button>
          </div>

          <div class="divide-y divide-slate-100">
            <template v-for="parent in topLevelItems" :key="parent.id">
              <!-- Parent item -->
              <div
                class="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-slate-50"
                :class="{ 'bg-violet-50/50 ring-1 ring-inset ring-violet-200': selectedId === parent.id }"
              >
                <GripVertical class="h-4 w-4 shrink-0 text-slate-300" />
                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100">
                  <component :is="iconMap[parent.icon] || FileText" class="h-3.5 w-3.5 text-slate-500" />
                </div>
                <button class="min-w-0 flex-1 text-left" @click="selectItem(parent)">
                  <p class="truncate text-sm font-medium text-slate-900">{{ parent.label }}</p>
                  <p class="truncate text-xs text-slate-400">{{ parent.url }}</p>
                </button>
                <span
                  v-if="!parent.isVisible"
                  class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400"
                >Hidden</span>
                <div class="flex shrink-0 items-center gap-0.5">
                  <button
                    class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    title="Toggle visibility"
                    @click="toggleVisibility(parent)"
                  >
                    <Eye v-if="parent.isVisible" class="h-3.5 w-3.5" />
                    <EyeOff v-else class="h-3.5 w-3.5" />
                  </button>
                  <button
                    class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    title="Move up"
                    @click="moveItem(parent, 'up')"
                  >
                    <ChevronUp class="h-3.5 w-3.5" />
                  </button>
                  <button
                    class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    title="Move down"
                    @click="moveItem(parent, 'down')"
                  >
                    <ChevronDown class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <!-- Children -->
              <template v-if="childrenOf[parent.id]">
                <div
                  v-for="child in childrenOf[parent.id]"
                  :key="child.id"
                  class="flex items-center gap-3 py-2.5 pl-16 pr-6 transition-colors hover:bg-slate-50"
                  :class="{ 'bg-violet-50/50 ring-1 ring-inset ring-violet-200': selectedId === child.id }"
                >
                  <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100">
                    <component :is="iconMap[child.icon] || FileText" class="h-3 w-3 text-slate-400" />
                  </div>
                  <button class="min-w-0 flex-1 text-left" @click="selectItem(child)">
                    <p class="truncate text-sm text-slate-700">{{ child.label }}</p>
                    <p class="truncate text-xs text-slate-400">{{ child.url }}</p>
                  </button>
                  <span
                    v-if="!child.isVisible"
                    class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400"
                  >Hidden</span>
                  <div class="flex shrink-0 items-center gap-0.5">
                    <button
                      class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      title="Toggle visibility"
                      @click="toggleVisibility(child)"
                    >
                      <Eye v-if="child.isVisible" class="h-3.5 w-3.5" />
                      <EyeOff v-else class="h-3.5 w-3.5" />
                    </button>
                    <button
                      class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      title="Move up"
                      @click="moveItem(child, 'up')"
                    >
                      <ChevronUp class="h-3.5 w-3.5" />
                    </button>
                    <button
                      class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      title="Move down"
                      @click="moveItem(child, 'down')"
                    >
                      <ChevronDown class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </template>
            </template>

            <!-- Empty state -->
            <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <Menu class="mb-3 h-10 w-10 text-slate-300" />
              <p class="text-sm font-medium text-slate-500">No menu items yet</p>
              <p class="mt-1 text-xs text-slate-400">Click "Add Item" to create your first menu entry.</p>
            </div>
          </div>
        </article>

        <!-- ═══════ RIGHT: Editor Form ═══════ -->
        <article class="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div class="border-b border-slate-100 px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
                <Pencil class="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold">{{ isNew ? 'New Item' : selectedId ? 'Edit Item' : 'Item Editor' }}</h2>
                <p class="text-sm text-slate-500">{{ isNew || selectedId ? 'Configure menu item properties.' : 'Select an item or add a new one.' }}</p>
              </div>
            </div>
          </div>

          <div v-if="isNew || selectedId" class="space-y-4 p-6">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Label</label>
              <input
                v-model="form.label"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Menu item label"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">URL</label>
              <input
                v-model="form.url"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="/path"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Icon</label>
              <div class="grid grid-cols-8 gap-1.5 rounded-lg border border-slate-300 p-2">
                <button
                  v-for="opt in iconOptions"
                  :key="opt.name"
                  class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                  :class="form.icon === opt.name ? 'bg-violet-100 text-violet-600 ring-1 ring-violet-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'"
                  :title="opt.name"
                  @click="form.icon = opt.name"
                >
                  <component :is="opt.component" class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Parent</label>
              <select
                v-model="form.parentId"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option :value="null">None (Top Level)</option>
                <option v-for="p in parentOptions" :key="p.id" :value="p.id">{{ p.label }}</option>
              </select>
            </div>
            <div class="flex items-center gap-3">
              <label class="relative inline-flex cursor-pointer items-center">
                <input v-model="form.isVisible" type="checkbox" class="peer sr-only" />
                <div class="h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-violet-600 peer-checked:after:translate-x-full" />
              </label>
              <span class="text-sm text-slate-700">Visible</span>
            </div>

            <div class="flex items-center gap-3 border-t border-slate-100 pt-4">
              <button
                class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50"
                :disabled="saving || !form.label || !form.url"
                @click="save"
              >
                <Save class="h-4 w-4" />
                {{ isNew ? 'Create' : 'Update' }}
              </button>
              <button
                v-if="!isNew && selectedId"
                class="flex items-center gap-2 rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                @click="remove"
              >
                <Trash2 class="h-4 w-4" />
                Delete
              </button>
              <button
                class="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                @click="cancelEdit"
              >
                <X class="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>

          <!-- No selection state -->
          <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Pencil class="mb-3 h-10 w-10 text-slate-300" />
            <p class="text-sm font-medium text-slate-500">No item selected</p>
            <p class="mt-1 text-xs text-slate-400">Click an item from the list or add a new one.</p>
          </div>
        </article>
      </div>
    </div>
  </AdminLayout>
</template>
