# UI Standard Kit + CMS POC

This repository now contains:
- Existing Next.js UI reference app at repo root.
- New CMS POC backend and admin frontend in `apps/*`.

## Apps

- `apps/api-server`: Express + Prisma + SQLite REST API.
- `apps/admin-web`: Vue 3 + Vite + Tailwind admin panel.

## Quick Start

```bash
npm install
cp apps/api-server/.env.example apps/api-server/.env
cp apps/admin-web/.env.example apps/admin-web/.env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev:cms
```

- API: `http://localhost:4000`
- Admin Web: `http://localhost:5173`
- Next.js UI reference (optional): `npm run dev:next`

## Default Admin Login

From `apps/api-server/.env`:
- `ADMIN_EMAIL=admin@example.com`
- `ADMIN_PASSWORD=admin12345`

## API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/:id`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `GET /api/pages`
- `POST /api/pages`
- `GET /api/pages/:id`
- `PUT /api/pages/:id`
- `DELETE /api/pages/:id`
- `GET /api/media`
- `POST /api/media/upload`
- `DELETE /api/media/:id`
- `GET /api/settings`
- `PUT /api/settings`
- `GET /api/dashboard/summary`
- `GET /api/health`

## Notes

- SQLite DB file is local (`apps/api-server/prisma/dev.db`).
- Uploads are local (`apps/api-server/uploads`).
- CSRF is enforced for non-GET authenticated API requests.
