import { Router } from "express";

import { sendOk } from "../utils/responses.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  sendOk(res, { status: "ok", timestamp: new Date().toISOString() });
});
