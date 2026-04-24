# Expense Tracker

A full-stack personal expense tracker with user authentication, spending visualizations, and a demo account for instant access.

## Features

### Authentication
- Email + password registration and login
- JWT-based sessions (7-day expiry), stored in localStorage
- Passwords hashed with bcrypt
- Each user's data is fully isolated — expenses are scoped to the authenticated user

### Demo Account
- Click **Try Demo** on the login screen to log in instantly — no signup required
- The demo account is seeded with 30 realistic sample expenses spanning the past 30 days
- Covers all six categories with Indian merchant names (Swiggy, Zomato, Myntra, Amazon, Decathlon, etc.)
- Re-seeded automatically on server startup if the demo account doesn't exist

### Spending Chart
- Donut pie chart (Recharts) breaking down expenses by category
- Segments sorted by spending amount (highest first)
- Custom tooltip showing category name and formatted amount
- Six color-coded categories: Food, Transport, Shopping, Health, Entertainment, Other

### Expense Management
- Add expenses with amount, category, description, and date
- Filter by category; sort by date ascending or descending
- Idempotency key on every POST — network retries and double-clicks never create duplicates

### UI
- Dark / light mode toggle, preference persisted to localStorage
- Responsive layout (sidebar + main content on desktop, stacked on mobile)
- Skeleton loading states, toast notifications, category badge pills

## Stack

- **Frontend**: Vite 6 + React 19 + TypeScript + TailwindCSS v4 + TanStack Query v5 + Recharts
- **Backend**: Node.js + Express 5 + TypeScript + Mongoose (MongoDB) + Zod + JWT
- **Deploy**: Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

## Design Decisions

**Money as integers** — amounts are stored as integer paise (cents) in MongoDB to avoid floating-point rounding errors. `₹12.50` is stored as `1250`. Formatting happens exclusively on the frontend.

**Idempotent POST** — every expense creation request carries a client-generated `Idempotency-Key` UUID header. The server deduplicates via a unique index on that key, so network retries, double-clicks, and page-refresh-after-submit all resolve safely without creating duplicate records.

**User-scoped expenses** — every expense document stores a `userId` foreign key. All reads and writes are filtered by the authenticated user's ID extracted from the JWT, so users can never access each other's data.

**MongoDB + Mongoose** — zero infrastructure overhead: Atlas free-tier M0 handles persistence, Render needs no attached disk. Mongoose gives typed schemas and straightforward query building without an ORM migration toolchain.

**TanStack Query** — handles server-state caching, loading/error states, and post-mutation cache invalidation. Mutations do not auto-retry (correct: user controls retries via button; idempotency key makes them safe).

**TailwindCSS v4** — CSS-first config via `@theme {}` in `index.css`, no `tailwind.config.js` needed.

## Trade-offs (timebox)

- No pagination — full list is fetched on each request; acceptable at personal-finance scale
- No edit or delete — expense lifecycle is create-only
- No optimistic updates — `useMutation` waits for server confirmation before updating the list

## Local Development

```bash
# Backend
cd server
cp .env.example .env          # fill in MONGODB_URI and JWT_SECRET
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
   - `JWT_SECRET=<random secret>`
   - `CLIENT_URL=<Vercel frontend URL>`
5. Deploy

### MongoDB Atlas

1. Create free **M0** cluster at atlas.mongodb.com
2. **Database Access** → add user with read/write permissions
3. **Network Access** → allow `0.0.0.0/0` (Render uses dynamic IPs)
4. **Connect** → Drivers → copy connection string → use as `MONGODB_URI`
