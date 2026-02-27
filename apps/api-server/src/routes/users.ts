import bcrypt from "bcryptjs";
import { Router } from "express";

import { prisma } from "../prisma.js";
import { sendError, sendOk } from "../utils/responses.js";
import { userInputSchema } from "./schemas.js";

export const usersRouter = Router();

function userPayload(user: { id: number; name: string; email: string; role: string; isActive: boolean; createdAt: Date; updatedAt: Date }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

// List users
usersRouter.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return sendOk(res, users.map(userPayload));
});

// Get single user
usersRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return sendError(res, 404, "NOT_FOUND", "User not found");
  return sendOk(res, userPayload(user));
});

// Create user
usersRouter.post("/", async (req, res) => {
  const input = userInputSchema.parse(req.body);

  if (!input.password) {
    return sendError(res, 400, "VALIDATION_ERROR", "Password is required for new users");
  }

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    return sendError(res, 409, "DUPLICATE_EMAIL", "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      isActive: input.isActive,
    },
  });

  return sendOk(res, userPayload(user));
});

// Update user
usersRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const input = userInputSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return sendError(res, 404, "NOT_FOUND", "User not found");

  // Check email uniqueness if changed
  if (input.email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email: input.email } });
    if (emailTaken) {
      return sendError(res, 409, "DUPLICATE_EMAIL", "A user with this email already exists");
    }
  }

  const data: Record<string, unknown> = {
    name: input.name,
    email: input.email,
    role: input.role,
    isActive: input.isActive,
  };

  if (input.password) {
    data.passwordHash = await bcrypt.hash(input.password, 10);
  }

  const user = await prisma.user.update({ where: { id }, data });
  return sendOk(res, userPayload(user));
});

// Delete user
usersRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return sendError(res, 404, "NOT_FOUND", "User not found");

  // Delete associated sessions first
  await prisma.session.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return sendOk(res, { success: true });
});
