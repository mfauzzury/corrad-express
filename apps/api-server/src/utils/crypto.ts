import crypto from "node:crypto";

import { env } from "../config/env.js";

export function signToken(rawToken: string) {
  return crypto.createHmac("sha256", env.sessionSecret).update(rawToken).digest("hex");
}

export function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("hex");
}
