# ORBITAL — Website Order System

A dark, planet-themed landing page with a multi-step order form. Orders are
saved to Postgres via Prisma. Includes a token-gated `/admin` page to review
and update order status.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL

## 1. Install

```bash
npm install
```

## 2. Set up Postgres

Use any Postgres provider — easiest options on Vercel:

- **Vercel Postgres** (Storage tab in your Vercel project → Create Database → Postgres)
- **Neon** (neon.tech, has a generous free tier, works great with Vercel)
- **Supabase**

Copy `.env.example` to `.env` and fill in the connection string(s):

```bash
cp .env.example .env
```

- `DATABASE_URL` — pooled connection string (used at runtime)
- `DIRECT_URL` — direct connection string (used for migrations). If your
  provider only gives one URL, use it for both.
- `ADMIN_TOKEN` — any long random string; this gates `/admin`

## 3. Create the database tables

```bash
npx prisma db push
```

This reads `prisma/schema.prisma` and creates the `Order` table (and enums)
in your Postgres database. No separate SQL needed.

Optional: browse your data with `npx prisma studio`.

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the site, and `http://localhost:3000/admin`
for the order dashboard (enter your `ADMIN_TOKEN` to load orders).

## 5. Deploy to Vercel

```bash
npm i -g vercel   # if you don't have it
vercel
```

Or push this folder to a GitHub repo and import it in the Vercel dashboard.

In **Vercel → Project → Settings → Environment Variables**, add:

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_TOKEN`

(If you created the database from the Vercel Storage tab, it can add
`DATABASE_URL`/`DIRECT_URL` for you automatically — double check the names
match what's above.)

Redeploy after adding env vars. `npm run build` runs `prisma generate`
automatically via the `postinstall`/`build` scripts, so no extra Vercel
config is needed.

**One-time step after first deploy:** run `npx prisma db push` once from
your machine (pointed at the production `DATABASE_URL`) to create the
tables in the live database, since Vercel's build step doesn't run
migrations for you.

## API

- `POST /api/orders` — public, submits a new order (validated with Zod)
- `GET /api/orders` — requires header `x-admin-token: <ADMIN_TOKEN>`, lists all orders
- `PATCH /api/orders/:id` — requires admin token, updates `status`
- `DELETE /api/orders/:id` — requires admin token, deletes an order

## Customizing the theme

Colors live in `tailwind.config.ts` (`void`, `abyss`, `nebula`, `quasar`,
`ember`, `mist`) and the planet/starfield styling is in `app/globals.css`
(`.planet`, `.starfield`, `.orbit`, `.glass`). Sector options and form
validation live in `lib/validation.ts`.
