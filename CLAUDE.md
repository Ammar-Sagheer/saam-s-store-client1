# Before doing anything in this repo

This is a client clone of the `saam-s-store` template, running on a
**shared multi-tenant Supabase project** — read these first, in order,
before making any changes:

1. **`FEATURES.md`** — what's active, what's intentionally disconnected
   (customer accounts, wishlist, Google OAuth), what was fully removed
   (the chat widget), the multi-tenant architecture, the backup habit,
   and the per-client setup checklist. This is the primary source of
   truth for this repo's current state.
2. **`CLIENTS.md`** — the actual registry of every client's tenant UUID,
   admin email, repo, and Vercel project. Never guess or reconstruct
   these from memory — this file is authoritative.
3. **`PROJECT_CONTEXT.md`** — historical background on the *original*
   pre-clone template only. Explicitly marked stale at the top; don't
   treat it as describing this repo's current state.

## If cloning this repo for a new client (client2, client3, ...)

Follow the checklist in `FEATURES.md` under "Per-client setup checklist"
exactly, and add the new client's row to `CLIENTS.md` once their tenant
is created — don't let a new client go untracked.

## Multi-tenant discipline

Every query against `categories`, `products`, `product_images`, `orders`,
`contacts`, and `hero_slides` MUST filter by `tenant_id` (via the
`TENANT_ID` env var) — both reads and writes. This is not optional; it's
the only thing preventing one client's site from showing another
client's data, since they all share one database. Before adding any new
table or query, check `FEATURES.md`'s architecture notes and follow the
same pattern.
