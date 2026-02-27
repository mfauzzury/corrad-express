<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Menu,
  ChevronUp,
  ChevronDown,
  Save,
  RotateCcw,
  Check,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import { DEFAULT_MENU, type AdminMenuPrefs } from "@/config/admin-menu";
import { useMenuStore } from "@/stores/menu";

const menuStore = useMenuStore();
const saving = ref(false);
const saved = ref(false);
const error = ref("");

const localPrefs = ref<AdminMenuPrefs>({
  groupOrder: DEFAULT_MENU.map((g) => g.id),
  itemOrder: Object.fromEntries(DEFAULT_MENU.map((g) => [g.id, g.items.map((i) => i.id)])),
  hidden: [],
  hiddenGroups: [],
});

function mergeWithDefaults(prefs: AdminMenuPrefs): AdminMenuPrefs {
  const allGroupIds = DEFAULT_MENU.map((g) => g.id);
  const groupOrder = [...prefs.groupOrder];
  for (const gid of allGroupIds) {
    if (!groupOrder.includes(gid)) groupOrder.push(gid);
  }

  const itemOrder: Record<string, string[]> = {};
  for (const group of DEFAULT_MENU) {
    const allItemIds = group.items.map((i) => i.id);
    const savedOrder = prefs.itemOrder[group.id] || [];
    const merged = [...savedOrder];
    for (const iid of allItemIds) {
      if (!merged.includes(iid)) merged.push(iid);
    }
    itemOrder[group.id] = merged.filter((iid) => allItemIds.includes(iid));
  }

  return {
    groupOrder: groupOrder.filter((gid) => allGroupIds.includes(gid)),
    itemOrder,
    hidden: prefs.hidden.filter((id) =>
      DEFAULT_MENU.some((g) => g.items.some((i) => i.id === id)),
    ),
    hiddenGroups: (prefs.hiddenGroups || []).filter((gid) => allGroupIds.includes(gid)),
  };
}

onMounted(async () => {
  await menuStore.load();
  if (menuStore.prefs) {
    localPrefs.value = mergeWithDefaults(menuStore.prefs);
  }
});

function getGroupLabel(groupId: string): string {
  return DEFAULT_MENU.find((g) => g.id === groupId)?.label ?? groupId;
}

function getItemDef(groupId: string, itemId: string) {
  const group = DEFAULT_MENU.find((g) => g.id === groupId);
  return group?.items.find((i) => i.id === itemId);
}

function isHidden(itemId: string): boolean {
  return localPrefs.value.hidden.includes(itemId);
}

function toggleVisibility(itemId: string) {
  const idx = localPrefs.value.hidden.indexOf(itemId);
  if (idx >= 0) {
    localPrefs.value.hidden.splice(idx, 1);
  } else {
    localPrefs.value.hidden.push(itemId);
  }
}

function moveGroup(groupId: string, direction: "up" | "down") {
  const arr = localPrefs.value.groupOrder;
  const idx = arr.indexOf(groupId);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= arr.length) return;
  [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
}

function moveItem(groupId: string, itemId: string, direction: "up" | "down") {
  const arr = localPrefs.value.itemOrder[groupId];
  if (!arr) return;
  const idx = arr.indexOf(itemId);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= arr.length) return;
  [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
}

async function save() {
  saving.value = true;
  saved.value = false;
  error.value = "";
  try {
    await menuStore.save(localPrefs.value);
    saved.value = true;
    setTimeout(() => { saved.value = false; }, 2000);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to save";
  } finally {
    saving.value = false;
  }
}

function isGroupHidden(groupId: string): boolean {
  return localPrefs.value.hiddenGroups.includes(groupId);
}

function toggleGroupVisibility(groupId: string) {
  const idx = localPrefs.value.hiddenGroups.indexOf(groupId);
  if (idx >= 0) {
    localPrefs.value.hiddenGroups.splice(idx, 1);
  } else {
    localPrefs.value.hiddenGroups.push(groupId);
  }
}

function resetToDefaults() {
  localPrefs.value = {
    groupOrder: DEFAULT_MENU.map((g) => g.id),
    itemOrder: Object.fromEntries(DEFAULT_MENU.map((g) => [g.id, g.items.map((i) => i.id)])),
    hidden: [],
    hiddenGroups: [],
  };
}
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-4">
      <!-- ───── Hero Header ───── -->
      <div class="flex items-center justify-between">
        <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-[1.45rem] font-bold tracking-tight text-transparent">Menu Configuration</h1>
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            @click="resetToDefaults"
          >
            <RotateCcw class="h-4 w-4" />
            Reset
          </button>
          <button
            class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50"
            :disabled="saving"
            @click="save"
          >
            <Check v-if="saved" class="h-4 w-4" />
            <Save v-else class="h-4 w-4" />
            {{ saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

      <!-- ───── Groups ───── -->
      <div class="space-y-4">
        <div
          v-for="(groupId, gi) in localPrefs.groupOrder"
          :key="groupId"
          class="rounded-lg border border-slate-200 bg-white shadow-sm transition-opacity"
          :class="{ 'opacity-50': isGroupHidden(groupId) }"
        >
          <!-- Group header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <div class="flex items-center gap-2">
              <Menu class="h-4 w-4 text-violet-600" />
              <h2 class="text-sm font-semibold text-slate-900">{{ getGroupLabel(groupId) }}</h2>
            </div>
            <div class="flex items-center gap-2">
              <div class="group relative">
                <button
                  class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors"
                  :class="isGroupHidden(groupId) ? 'bg-slate-400' : 'bg-violet-600'"
                  @click="toggleGroupVisibility(groupId)"
                >
                  <span
                    class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
                    :class="isGroupHidden(groupId) ? 'translate-x-[2px]' : 'translate-x-[18px]'"
                  />
                </button>
                <span class="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{{ isGroupHidden(groupId) ? 'Show group' : 'Hide group' }}</span>
              </div>
              <button
                class="group relative flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                :disabled="gi === 0"
                @click="moveGroup(groupId, 'up')"
              >
                <ChevronUp class="h-4 w-4" />
                <span class="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Move up</span>
              </button>
              <button
                class="group relative flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                :disabled="gi === localPrefs.groupOrder.length - 1"
                @click="moveGroup(groupId, 'down')"
              >
                <ChevronDown class="h-4 w-4" />
                <span class="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Move down</span>
              </button>
            </div>
          </div>

          <!-- Items in group -->
          <div class="divide-y divide-slate-50">
            <div
              v-for="(itemId, ii) in (localPrefs.itemOrder[groupId] || [])"
              :key="itemId"
              class="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-slate-50"
              :class="{ 'opacity-40': isHidden(itemId) }"
            >
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100">
                <component :is="getItemDef(groupId, itemId)?.icon" class="h-3.5 w-3.5 text-slate-500" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-slate-900">{{ getItemDef(groupId, itemId)?.label }}</p>
                <p class="truncate text-xs text-slate-400">{{ getItemDef(groupId, itemId)?.to }}</p>
              </div>
              <div v-if="getItemDef(groupId, itemId)?.children" class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                {{ getItemDef(groupId, itemId)!.children!.length }} sub
              </div>
              <div class="flex shrink-0 items-center gap-2">
                <div class="group relative">
                  <button
                    class="relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors"
                    :class="isHidden(itemId) ? 'bg-slate-400' : 'bg-violet-600'"
                    @click="toggleVisibility(itemId)"
                  >
                    <span
                      class="inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform"
                      :class="isHidden(itemId) ? 'translate-x-[2px]' : 'translate-x-[14px]'"
                    />
                  </button>
                  <span class="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{{ isHidden(itemId) ? 'Show' : 'Hide' }}</span>
                </div>
                <button
                  class="group relative flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                  :disabled="ii === 0"
                  @click="moveItem(groupId, itemId, 'up')"
                >
                  <ChevronUp class="h-3.5 w-3.5" />
                  <span class="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Move up</span>
                </button>
                <button
                  class="group relative flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                  :disabled="ii === (localPrefs.itemOrder[groupId] || []).length - 1"
                  @click="moveItem(groupId, itemId, 'down')"
                >
                  <ChevronDown class="h-3.5 w-3.5" />
                  <span class="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Move down</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
