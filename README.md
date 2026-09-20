# Fashion E‑Commerce Dashboard

Admin CMS for managing products, variants, and categories.

**Live:** https://fashion-ecommerce-dashboard.vercel.app

## Stack

React 19 · Vite · TypeScript · TanStack Router/Query · Zustand · React Hook Form + Zod · Tailwind v4 · shadcn/ui · i18n (EN/AR)

## Demo login

| Field | Value |
|---|---|
| Phone | `01111803604` |
| Password | `Shams@123` |

## Local setup

```bash
yarn install
cp .env.example .env
yarn dev
```

App runs at http://localhost:5173

### Env vars

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (includes `/api/v1`) |
| `VITE_STOREFRONT_URL` | Storefront URL for ISR cache revalidation |

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start dev server |
| `yarn build` | Production build |
| `yarn preview` | Preview production build |
| `yarn test` | Run unit tests |
| `yarn lint` | Lint the project |

## Related repos

| Repo | Role |
|---|---|
| `fashion-ecommerce-backend` | Express + MongoDB API |
| `fashion-ecommerce-frontend` | Next.js storefront |

Production API: `https://fashion-ecommerce-backend-teal.vercel.app/api/v1`

For full architecture details, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
