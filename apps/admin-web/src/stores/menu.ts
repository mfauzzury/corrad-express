import { defineStore } from "pinia";
import { DEFAULT_MENU, type AdminMenuPrefs, type MenuGroupDef } from "@/config/admin-menu";
import { getAdminMenuPrefs, saveAdminMenuPrefs } from "@/api/cms";

function resolveMenu(prefs: AdminMenuPrefs | null): MenuGroupDef[] {
  if (!prefs) return DEFAULT_MENU;

  const groupMap = new Map(DEFAULT_MENU.map((g) => [g.id, g]));
  const ordered: MenuGroupDef[] = [];

  for (const gid of prefs.groupOrder) {
    if (groupMap.has(gid)) {
      ordered.push(groupMap.get(gid)!);
      groupMap.delete(gid);
    }
  }
  for (const g of groupMap.values()) ordered.push(g);

  const hiddenGroups = prefs.hiddenGroups || [];

  return ordered
    .filter((g) => !hiddenGroups.includes(g.id))
    .map((group) => {
      const itemMap = new Map(group.items.map((i) => [i.id, i]));
      const sortedItems = [];
      const itemOrderList = prefs.itemOrder[group.id] || [];

      for (const iid of itemOrderList) {
        if (itemMap.has(iid)) {
          sortedItems.push(itemMap.get(iid)!);
          itemMap.delete(iid);
        }
      }
      for (const i of itemMap.values()) sortedItems.push(i);

      return {
        ...group,
        items: sortedItems.filter((i) => !prefs.hidden.includes(i.id)),
      };
    })
    .filter((g) => g.items.length > 0);
}

export const useMenuStore = defineStore("menu", {
  state: () => ({
    prefs: null as AdminMenuPrefs | null,
    initialized: false,
  }),
  getters: {
    resolvedMenu(): MenuGroupDef[] {
      return resolveMenu(this.prefs);
    },
  },
  actions: {
    async load() {
      if (this.initialized) return;
      try {
        const res = await getAdminMenuPrefs();
        this.prefs = res.data;
      } catch {
        // use defaults
      }
      this.initialized = true;
    },
    async save(prefs: AdminMenuPrefs) {
      await saveAdminMenuPrefs(prefs);
      this.prefs = prefs;
    },
  },
});
