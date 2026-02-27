import { Router } from "express";

import { prisma } from "../prisma.js";
import type { SettingsPayload } from "../types.js";
import { sendOk } from "../utils/responses.js";
import { settingsInputSchema } from "./schemas.js";

const SETTINGS_KEYS: Array<keyof SettingsPayload> = [
  "siteTitle",
  "tagline",
  "titleFormat",
  "metaDescription",
  "siteIconUrl",
  "faviconUrl",
  "language",
  "timezone",
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
