import { Router } from "express";

import { prisma } from "../prisma.js";
import { sendError, sendOk } from "../utils/responses.js";
import { roleInputSchema } from "./schemas.js";

export const rolesRouter = Router();

function rolePayload(role: { id: number; name: string; description: string; permissions: string; createdAt: Date; updatedAt: Date }) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: JSON.parse(role.permissions) as string[],
    createdAt: role.createdAt.toISOString(),
    updatedAt: role.updatedAt.toISOString(),
  };
}

// List roles
rolesRouter.get("/", async (_req, res) => {
  const roles = await prisma.role.findMany({ orderBy: { createdAt: "desc" } });
  return sendOk(res, roles.map(rolePayload));
});

// Get single role
rolesRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) return sendError(res, 404, "NOT_FOUND", "Role not found");
  return sendOk(res, rolePayload(role));
});

// Create role
rolesRouter.post("/", async (req, res) => {
  const input = roleInputSchema.parse(req.body);

  const existing = await prisma.role.findUnique({ where: { name: input.name } });
  if (existing) {
    return sendError(res, 409, "DUPLICATE_NAME", "A role with this name already exists");
  }

  const role = await prisma.role.create({
    data: {
      name: input.name,
      description: input.description,
      permissions: JSON.stringify(input.permissions),
    },
  });

  return sendOk(res, rolePayload(role));
});

// Update role
rolesRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const input = roleInputSchema.parse(req.body);

  const existing = await prisma.role.findUnique({ where: { id } });
  if (!existing) return sendError(res, 404, "NOT_FOUND", "Role not found");

  // Check name uniqueness if changed
  if (input.name !== existing.name) {
    const nameTaken = await prisma.role.findUnique({ where: { name: input.name } });
    if (nameTaken) {
      return sendError(res, 409, "DUPLICATE_NAME", "A role with this name already exists");
    }
  }

  const role = await prisma.role.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      permissions: JSON.stringify(input.permissions),
    },
  });

  return sendOk(res, rolePayload(role));
});

// Delete role
rolesRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.role.findUnique({ where: { id } });
  if (!existing) return sendError(res, 404, "NOT_FOUND", "Role not found");

  await prisma.role.delete({ where: { id } });
  return sendOk(res, { success: true });
});
