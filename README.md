# CMS Release Setup

This repository contains a CMS stack:
- `apps/api-server`: Express + Prisma + SQLite API
- `apps/admin-web`: Vue 3 + Vite admin panel

The root Next.js app is optional reference UI and is not required to run CMS.

## Clean Setup (Recommended)

Run from repo root:

```bash
npm run clean:all
npm run setup:cms
npm run dev:cms
```

What this does:
- Removes old build/cache/local state (`clean:all`)
- Installs dependencies
- Creates missing `.env` files from `.env.example`
- Generates Prisma client
- Pushes database schema
- Seeds default data
- Starts API + Admin in dev mode

## URLs

- API: `http://localhost:4000`
- Admin Web: `http://localhost:5173`

## Default Admin Login

From `apps/api-server/.env`:
- `ADMIN_EMAIL=admin@example.com`
- `ADMIN_PASSWORD=admin12345`

## Common Commands

```bash
npm run clean        # remove generated files, keep local DB/uploads/.env
npm run clean:all    # full reset including .env, SQLite DB, uploads
npm run setup:cms    # one-command CMS bootstrap
npm run dev:cms      # run api + admin
npm run build:cms    # build api + admin
```

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
