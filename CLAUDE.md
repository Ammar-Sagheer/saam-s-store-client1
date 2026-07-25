# Before doing anything in this repo

This is a client clone of the `saam-s-store` template, running on a
**shared multi-tenant Supabase project** — read these first, in order,
before making any changes:

1. **`CURRENT_BUILD.md`** — is there a client build already in progress?
   Read this FIRST, before anything else. It tells you exactly what's
   done and what's left on whatever client was being built when work
   last stopped — possibly a week or more ago. Don't assume a clean
   slate without checking this.
2. **`FEATURES.md`** — what's active, what's intentionally disconnected
   (customer accounts, wishlist, Google OAuth), what was fully removed
   (the chat widget), the multi-tenant architecture, the backup habit,
   and the per-client setup checklist. This is the primary source of
   truth for this repo's current state.
3. **`CLIENTS.md`** — the actual registry of every *finished* client's
   tenant UUID, admin email, repo, and Vercel project. Never guess or
   reconstruct these from memory — this file is authoritative.
4. **`PROJECT_CONTEXT.md`** — historical background on the *original*
   pre-clone template only. Explicitly marked stale at the top; don't
   treat it as describing this repo's current state.

## If cloning this repo for a new client (client2, client3, ...)

1. Copy the template block from `CURRENT_BUILD.md` into its "Status"
   section, set it to "IN PROGRESS", and keep it updated — check items
   off as they're actually done, update "Last updated" every session,
   don't let it go stale mid-build.
2. Follow the checklist in `FEATURES.md` under "Per-client setup
   checklist".
3. Once finished: add the client's row to `CLIENTS.md`, then reset
   `CURRENT_BUILD.md` back to "No build currently in progress".

## Standing habits — act on these phrases without being walked through it

The user will often trigger these with a short, casual phrase rather than
a full instruction. Recognize them and act:

- **"Client N work done" / "client done" / similar** — the user just
  finished onboarding a new client. Update `CLIENTS.md` with that
  client's row (tenant slug, tenant UUID, admin email, repo, Vercel
  project, domain if known). If anything about the architecture changed
  while building them, update `FEATURES.md` too. Reset `CURRENT_BUILD.md`
  back to "No build currently in progress". Don't wait to be asked for
  each file separately — all three get checked/updated as one action.
- **During an in-progress client build** — update `CURRENT_BUILD.md` as
  steps actually complete (check items off, update "Last updated"), not
  just at the very start or end. The whole point is that work can stop
  for a week and pick back up cleanly — a stale checklist defeats that.
- **"Backup" / "occasional backup" / "do a backup"** — run the full
  backup process documented in `FEATURES.md` under "Maintenance habit":
  the data export SQL (all tables, tenant-scoped as needed) AND the
  image export (curl each `image_url` found, since the bucket is
  public-read) — a data-only export is NOT a complete backup, both
  parts are required every time. Deliver the resulting files to the
  user; don't just describe that it could be done.

Treat both of these as standing instructions, not one-off requests —
they apply every time the trigger phrase shows up, in any future
session, without the user needing to re-explain the process.

## Multi-tenant discipline

Every query against `categories`, `products`, `product_images`, `orders`,
`contacts`, and `hero_slides` MUST filter by `tenant_id` (via the
`TENANT_ID` env var) — both reads and writes. This is not optional; it's
the only thing preventing one client's site from showing another
client's data, since they all share one database. Before adding any new
table or query, check `FEATURES.md`'s architecture notes and follow the
same pattern.
