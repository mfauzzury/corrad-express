import { before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";

import bcrypt from "bcryptjs";
import request from "supertest";

import { app } from "../app.js";
import { prisma } from "../prisma.js";

const agent = request.agent(app);

let csrfToken = "";
let createdPostId = 0;
let createdPageId = 0;

before(async () => {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin12345";
  const adminName = process.env.ADMIN_NAME ?? "Administrator";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });
});

beforeEach(async () => {
  await prisma.post.deleteMany();
  await prisma.page.deleteMany();
  await prisma.session.deleteMany();

  const loginResponse = await agent.post("/api/auth/login").send({
    email: process.env.ADMIN_EMAIL ?? "admin@example.com",
    password: process.env.ADMIN_PASSWORD ?? "admin12345",
  });

  assert.equal(loginResponse.status, 200);

  const meResponse = await agent.get("/api/auth/me");
  assert.equal(meResponse.status, 200);
  csrfToken = meResponse.body.data.csrfToken;
});

describe("API smoke", () => {
  it("blocks protected route without auth", async () => {
    const res = await request(app).get("/api/posts");
    assert.equal(res.status, 401);
  });

  it("creates and fetches post", async () => {
    const create = await agent
      .post("/api/posts")
      .set("x-csrf-token", csrfToken)
      .send({ title: "Post A", content: "Body", status: "draft" });

    assert.equal(create.status, 200);
    createdPostId = create.body.data.id;

    const getOne = await agent.get(`/api/posts/${createdPostId}`);
    assert.equal(getOne.status, 200);
    assert.equal(getOne.body.data.title, "Post A");
  });

  it("enforces slug uniqueness", async () => {
    const first = await agent
      .post("/api/posts")
      .set("x-csrf-token", csrfToken)
      .send({ title: "Same Title", content: "A", status: "draft" });

    const second = await agent
      .post("/api/posts")
      .set("x-csrf-token", csrfToken)
      .send({ title: "Same Title", content: "B", status: "draft" });

    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    assert.notEqual(first.body.data.slug, second.body.data.slug);
  });

  it("creates and updates page", async () => {
    const create = await agent
      .post("/api/pages")
      .set("x-csrf-token", csrfToken)
      .send({ title: "Page A", content: "Body", status: "draft" });

    assert.equal(create.status, 200);
    createdPageId = create.body.data.id;

    const update = await agent
      .put(`/api/pages/${createdPageId}`)
      .set("x-csrf-token", csrfToken)
      .send({ title: "Page Updated", content: "Body2", status: "published" });

    assert.equal(update.status, 200);
    assert.equal(update.body.data.title, "Page Updated");
  });

  it("validates settings update", async () => {
    const invalid = await agent.put("/api/settings").set("x-csrf-token", csrfToken).send({});
    assert.equal(invalid.status, 400);

    const valid = await agent.put("/api/settings").set("x-csrf-token", csrfToken).send({
      siteTitle: "CMS",
      tagline: "Tag",
      titleFormat: "%page% | %site%",
      metaDescription: "desc",
      siteIconUrl: "",
      faviconUrl: "",
      language: "en",
      timezone: "UTC",
    });

    assert.equal(valid.status, 200);
    assert.equal(valid.body.data.siteTitle, "CMS");
  });

  it("rejects csrf mismatch", async () => {
    const response = await agent.post("/api/posts").set("x-csrf-token", "bad-token").send({
      title: "No CSRF",
      content: "Body",
      status: "draft",
    });

    assert.equal(response.status, 403);
  });

  it("supports logout and invalidates session", async () => {
    const logout = await agent.post("/api/auth/logout").set("x-csrf-token", csrfToken);
    assert.equal(logout.status, 200);

    const me = await agent.get("/api/auth/me");
    assert.equal(me.status, 401);
  });
});
