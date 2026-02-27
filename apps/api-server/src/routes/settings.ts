import { Router } from "express";

import { prisma } from "../prisma.js";
import type { SettingsPayload } from "../types.js";
import { sendOk } from "../utils/responses.js";
import { adminMenuPrefsSchema, settingsInputSchema } from "./schemas.js";

const SETTINGS_KEYS: Array<keyof SettingsPayload> = [
  "siteTitle",
  "tagline",
  "titleFormat",
  "metaDescription",
  "siteIconUrl",
  "faviconUrl",
  "language",
  "timezone",
  "footerText",
];

export const settingsRouter = Router();

settingsRouter.get("/", async (_req, res) => {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value])) as Partial<SettingsPayload>;

  const payload: SettingsPayload = {
    siteTitle: map.siteTitle ?? "",
    tagline: map.tagline ?? "",
    titleFormat: map.titleFormat ?? "%page% | %site%",
    metaDescription: map.metaDescription ?? "",
    siteIconUrl: map.siteIconUrl ?? "",
    faviconUrl: map.faviconUrl ?? "",
    language: map.language ?? "en",
    timezone: map.timezone ?? "UTC",
    footerText: map.footerText ?? "",
  };

  return sendOk(res, payload);
});

settingsRouter.put("/", async (req, res) => {
  const payload = settingsInputSchema.parse(req.body);

  await prisma.$transaction(
    SETTINGS_KEYS.map((key) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: payload[key] },
        create: { key, value: payload[key] },
      }),
    ),
  );

  return sendOk(res, payload);
});

settingsRouter.get("/admin-menu-prefs", async (_req, res) => {
  const row = await prisma.setting.findUnique({ where: { key: "adminMenuPrefs" } });
  return sendOk(res, row ? JSON.parse(row.value) : null);
});

settingsRouter.put("/admin-menu-prefs", async (req, res) => {
  const prefs = adminMenuPrefsSchema.parse(req.body);
  await prisma.setting.upsert({
    where: { key: "adminMenuPrefs" },
    update: { value: JSON.stringify(prefs) },
    create: { key: "adminMenuPrefs", value: JSON.stringify(prefs) },
  });
  return sendOk(res, prefs);
});
