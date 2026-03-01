import { defineStore } from "pinia";
import { getSettings } from "@/api/cms";
import type { SettingsPayload } from "@/types";

export const useSiteStore = defineStore("site", {
  state: () => ({
    siteTitle: "CORRAD Xpress",
    titleFormat: "%page% | %site%",
    siteIconUrl: "",
    sidebarLogoUrl: "",
    footerText: "",
    initialized: false,
  }),
  actions: {
    async load() {
      try {
        const res = await getSettings();
        const d = res.data;
        this.siteTitle = d.siteTitle || "CORRAD Xpress";
        this.titleFormat = d.titleFormat || "%page% | %site%";
        this.siteIconUrl = d.siteIconUrl || "";
        this.sidebarLogoUrl = d.sidebarLogoUrl || "";
        this.footerText = d.footerText || "";
        this.initialized = true;
      } catch {
        // use defaults
      }
    },
    applyFrom(payload: SettingsPayload) {
      this.siteTitle = payload.siteTitle || "CORRAD Xpress";
      this.titleFormat = payload.titleFormat || "%page% | %site%";
      this.siteIconUrl = payload.siteIconUrl || "";
      this.sidebarLogoUrl = payload.sidebarLogoUrl || "";
      this.footerText = payload.footerText || "";
    },
    setDocumentTitle(pageTitle: string) {
      document.title = this.titleFormat
        .replace("%page%", pageTitle)
        .replace("%site%", this.siteTitle);
    },
  },
});
