# Pre Loved Men's Collection

A mobile-first e-commerce thrift store for pre-loved branded men's clothing, selling at discounted PKR prices with nationwide delivery.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/preloved-store run dev` — run the storefront (port 22242)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS + Wouter (routing) + TanStack React Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v3), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/products.ts` — categories, brands, products tables
- `lib/db/src/schema/orders.ts` — orders table
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/preloved-store/src/` — React frontend

## Architecture decisions

- Cart is local React state (not persisted to DB) — keeps it fast and simple for a thrift store
- Products use `numeric` in DB but are returned as `number` from API (parsed in route handlers)
- Orders store `items` as JSONB — avoids a separate order_items table for this use case
- All integer fields in OpenAPI spec are `type: number` (not `type: integer`) to avoid `zod.int()` which only exists in Zod v4; workspace uses Zod v3

## Product

- **Storefront**: Announcement bar, hero, categories grid, brands grid (filter by brand), featured products, product detail, cart & checkout
- **Admin**: Dashboard stats, products CRUD, order management with status updates (pending → dispatched → delivered)
- **WhatsApp**: Floating button → wa.me/923182082052 with pre-filled greeting
- **Currency**: All prices in Rs. (Pakistani Rupees)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT use `type: integer` in the OpenAPI spec — use `type: number` instead. Orval generates `zod.int()` for integers which doesn't exist in Zod v3.
- The `orders.items` column is JSONB — cast appropriately when reading
- Run `pnpm --filter @workspace/api-spec run codegen` after every spec change
- `serial()` columns in Drizzle behave as `notNull` references; use `integer()` for nullable FK fields

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
