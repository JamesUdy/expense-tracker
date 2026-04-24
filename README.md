# Expense Tracker

A full-stack personal expense tracker. Record, filter, and review your expenses with a clean, responsive UI.

## Stack

- **Frontend**: Vite 6 + React 19 + TypeScript + TailwindCSS v4 + TanStack Query v5
- **Backend**: Node.js + Express 5 + TypeScript + Mongoose (MongoDB)
- **Deploy**: Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

## Design Decisions

**Money as integers** — amounts are stored as integer paise (cents) in MongoDB to avoid floating-point rounding errors. `₹12.50` is stored as `1250`. Formatting happens exclusively on the frontend.

**Idempotent POST** — every expense creation request carries a client-generated `Idempotency-Key` UUID header. The server deduplicates via a unique index on that key, so network retries, double-clicks, and page-refresh-after-submit all resolve safely without creating duplicate records.

**MongoDB + Mongoose** — zero infrastructure overhead: Atlas free-tier M0 handles persistence, Render needs no attached disk. Mongoose gives typed schemas and straightforward query building without an ORM migration toolchain.

**TanStack Query** — handles server-state caching, loading/error states, and post-mutation cache invalidation. Mutations do not auto-retry (correct: user controls retries via button; idempotency key makes them safe).

**TailwindCSS v4** — CSS-first config via `@theme {}` in `index.css`, no `tailwind.config.js` needed.

## Trade-offs (timebox)

- No pagination — full list is fetched on each request; acceptable at personal-finance scale
- No authentication — single-user tool assumption
- No optimistic updates — `useMutation` waits for server confirmation before updating the list

## Local Development

```bash
# Backend
cd server
cp .env.example .env          # fill in MONGODB_URI
npm install
npm run dev                   # http://localhost:3001

# Frontend
cd client
cp .env.example .env.local    # set VITE_API_URL=http://localhost:3001
npm install
npm run dev                   # http://localhost:5173
```

## Running Tests

```bash
cd server
npm test
```

## Deployment

See the **Deployment** section below for step-by-step instructions.

### Vercel (Frontend)

1. Push repo to GitHub
2. Import project on Vercel → set **Root Directory** to `client`
3. Framework preset: **Vite** (auto-detected)
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Deploy — every push to `main` auto-redeploys

### Render (Backend)

1. New **Web Service** → connect GitHub repo → **Root Directory**: `server`
2. Build command: `npm install && npm run build`
3. Start command: `node dist/index.js`
4. Add environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=<Atlas connection string>`
   - `CLIENT_URL=<Vercel frontend URL>`
5. Deploy

### MongoDB Atlas

1. Create free **M0** cluster at atlas.mongodb.com
2. **Database Access** → add user with read/write permissions
3. **Network Access** → allow `0.0.0.0/0` (Render uses dynamic IPs)
4. **Connect** → Drivers → copy connection string → use as `MONGODB_URI`
