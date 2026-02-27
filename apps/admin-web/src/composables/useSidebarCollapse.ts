import { ref, watch } from "vue";

const STORAGE_KEY = "admin-sidebar-collapsed";

const isCollapsed = ref<boolean>(
  localStorage.getItem(STORAGE_KEY) === "true"
);

watch(isCollapsed, (val) => {
  localStorage.setItem(STORAGE_KEY, String(val));
});

export function useSidebarCollapse() {
  function toggle() {
    isCollapsed.value = !isCollapsed.value;
  }
  return { isCollapsed, toggle };
}
