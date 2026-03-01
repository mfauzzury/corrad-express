import type { Component } from "vue";
import {
  Braces,
  Database,
  FileText,
  Gauge,
  Image,
  LayoutGrid,
  Menu,
  Settings,
} from "lucide-vue-next";

export type MenuChild = {
  label: string;
  to: string;
};

export type MenuItemDef = {
  id: string;
  label: string;
  to: string;
  icon: Component;
  children?: MenuChild[];
};

export type MenuGroupDef = {
  id: string;
  label: string;
  items: MenuItemDef[];
};

export type AdminMenuPrefs = {
  groupOrder: string[];
  itemOrder: Record<string, string[]>;
  hidden: string[];
  hiddenGroups: string[];
};

export const DEFAULT_MENU: MenuGroupDef[] = [
  {
    id: "dashboard",
    label: "",
    items: [
      { id: "main-dashboard", label: "Dashboard", to: "/", icon: Gauge },
    ],
  },
  {
    id: "portal",
    label: "Portal",
    items: [
      { id: "dashboard", label: "Portal Dashboard", to: "/portal/dashboard", icon: Gauge },
      {
        id: "posts",
        label: "Posts",
        to: "/posts",
        icon: FileText,
        children: [
          { label: "All Posts", to: "/posts" },
          { label: "Add New", to: "/posts/new" },
          { label: "Categories", to: "/categories" },
        ],
      },
      {
        id: "pages",
        label: "Pages",
        to: "/pages",
        icon: FileText,
        children: [
          { label: "All Pages", to: "/pages" },
          { label: "Add New", to: "/pages/new" },
        ],
      },
      {
        id: "media",
        label: "Media",
        to: "/media",
        icon: Image,
        children: [{ label: "Library", to: "/media" }],
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      { id: "menus", label: "Menus", to: "/menus", icon: Menu },
      {
        id: "settings",
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
    ],
  },
  {
    id: "development",
    label: "Development",
    items: [
      { id: "database-schema", label: "Database Schema", to: "/development/database-schema", icon: Database },
      { id: "api-management", label: "API Management", to: "/development/api-management", icon: Braces },
      {
        id: "kitchen-sink",
        label: "Kitchen Sink",
        to: "/kitchen-sink",
        icon: LayoutGrid,
        children: [
          { label: "Components", to: "/kitchen-sink" },
          { label: "Forms", to: "/kitchen-sink/forms" },
          { label: "Charts", to: "/kitchen-sink/charts" },
        ],
      },
    ],
  },
];
