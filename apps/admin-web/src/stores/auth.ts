import { defineStore } from "pinia";

import { getMe, login, logout } from "@/api/auth";
import type { User } from "@/types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    loading: false,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    async initialize() {
      if (this.initialized) return;
      this.initialized = true;
      try {
        const response = await getMe();
        this.user = response.data.user;
      } catch {
        this.user = null;
      }
    },
    async signIn(email: string, password: string) {
      this.loading = true;
      try {
        await login(email, password);
        const me = await getMe();
        this.user = me.data.user;
      } finally {
        this.loading = false;
      }
    },
    async signOut() {
      await logout();
      this.user = null;
    },
  },
});
