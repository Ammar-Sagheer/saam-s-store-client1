# Feature Status — saam-s-store-client1

This repo is a clone of the `saam-s-store` template, adapted to run as one
tenant in a **shared multi-tenant Supabase project** used for dummy
proof-of-business storefronts (not real e-commerce). This file tracks what
the original template had, what's active here, and what was deliberately
turned off — so a future session (or future-you) doesn't have to
re-derive it from the diff.

**See `CLIENTS.md`** for the actual registry of every client's tenant
UUID, admin email, repo, and Vercel project — don't rely on memory or
chat history for that; it's tracked there.

## Active / in use

- Storefront browsing, search, filters, cart (localStorage), guest checkout
- Order confirmation + order tracking (`/track-order`, id + email lookup)
- Full admin panel (`/admin`), products/categories/orders/messages CRUD
- **Hero banner** (`/admin/hero`) — new feature, not in the original
  template. Homepage hero slides (title/subtitle/description/CTA/image)
  are now DB-backed (`hero_slides` table, tenant-scoped) and editable per
  client from the admin panel, instead of being hardcoded in
  `HeroSection.js`. Falls back to a single generic slide with no image if
  the admin hasn't added any slides yet.
- **Client-side image compression before upload** (`app/_lib/compressImage.js`)
  — new, not in the original template. Every admin image upload path
  (products, categories, hero slides, bulk import) resizes + re-encodes
  as JPEG via the Canvas API before it reaches Supabase Storage, falling
  back to the original file if compression fails for any reason. Added
  because unoptimized stock photos (hero/category images) were averaging
  2.5-2.7MB each — a real constraint on the shared project's storage
  quota at scale (see "How many clients fit" math, not yet written down
  here but discussed when this was built — rough rule of thumb: ~12-20
  clients on Supabase free tier's 1GB storage before compression, closer
  to double that after).
- **Navbar category dropdown is DB-driven, not hardcoded** — root layout
  (`app/layout.js`) fetches real categories and passes them through
  `AppChrome` → `Navbar`, so the dropdown always matches whatever
  categories this specific tenant actually has. The original template
  had a hardcoded category list in `Navbar.js` that would have been
  wrong for every client clone unless manually edited each time. The
  fetch is wrapped in try/catch since it now runs on every route
  (including `/admin` pages that don't render the navbar) — falls back
  to an empty dropdown rather than ever taking the whole site down.
- Multi-tenant scoping: every query filtered by `TENANT_ID` env var;
  admin writes checked against `store_admins` table (see `PROJECT_CONTEXT.md`
  history and the `multi_tenant_refactor` Supabase migration for the
  original single-tenant → multi-tenant change)
- Storage bucket uploads scoped per-tenant folder
  (`{tenant_id}/products/...`, `{tenant_id}/categories/...`,
  `{tenant_id}/hero/...`), enforced by
  storage RLS against `store_admins`, not just app convention
- Bank-transfer manual payment flow (checkout + order confirmation)

## Removed from this clone (template had it, we don't use it here)

- **AI chat widget** (`app/_components/chat/ChatWidget.js`,
  `app/api/chat/route.js`) — deleted entirely, not just disabled. The
  external agent backend it called isn't tenant-aware; would need
  significant rework to be safe across multiple clients sharing one DB.
  Not needed for a dummy site anyway.

## Present in the codebase but disconnected from navigation (dormant, not deleted)

These still exist as working code/routes — Google OAuth is just not
configured in Supabase, so they're unreachable via normal UI. Kept
intentionally in case a specific client ever needs real customer accounts.

- **Customer accounts / Google OAuth login** — `app/auth/callback/route.js`,
  `app/_components/account/AccountLoginPrompt.js`,
  `app/_components/account/AccountDashboard.js`, `/account` page
- **Order history for logged-in customers** — `/orders` page
- **Saved addresses** — `/addresses` page,
  `app/_components/account/AddressList.js`, `AddressForm.js`
- **Profile settings** — `/settings` page,
  `app/_components/account/SettingsForm.js`
- **Wishlist** — `/wishlist` page, `toggleWishlistAction` in
  `app/_lib/actions.js`. The wishlist heart button was removed from
  `ProductCard.js` (it was 100% login-gated and just showed a
  "please sign in" dead end with no login path exposed).
- **Navbar** no longer shows an account/profile icon or avatar. The icon
  slot now links to `/track-order` instead (see git history on
  `app/_components/layout/Navbar.js` for the pre-change version with the
  Google avatar rendering).

### If a client ever needs real accounts (re-enabling Google OAuth)

1. Google Cloud Console → APIs & Services → Credentials → OAuth client ID
   (Web application). Add this client's Vercel domain(s) to the authorized
   redirect URIs.
2. Supabase dashboard → Authentication → Providers → Google → paste
   Client ID + Secret.
3. Add the account/profile icon back to `Navbar.js` (see git history).
4. Re-add the wishlist heart button to `ProductCard.js` (see git history).
5. Known caveat: this Supabase project is shared across multiple tenants,
   so Google OAuth is configured *once* at the project level — the
   consent screen will show one shared app name across every client site
   sharing this project, not each client's individual brand. Also, an
   unverified Google OAuth app shows a "Google hasn't verified this app"
   warning to visitors, which can look untrustworthy — worth going
   through Google's verification if this becomes a real, ongoing feature
   rather than a one-off test.

## Disaster recovery

`supabase/disaster_recovery.sql` in this repo recreates the full shared
backend structure (all tables, tenant-scoped RLS policies, RPC functions,
storage bucket + tenant-folder policies) on a brand-new Supabase project
in one run, generated from the live project's actual schema — not from
memory. It restores structure only, not data: every table comes back
empty, and you re-seed `tenants`/`store_admins` per client afterward (see
the commented example at the bottom of the file) and recreate each
client's admin user manually. Regenerate this file if the schema changes
further, so it doesn't drift from what's actually deployed.

Note the real cost of the shared-project design: since every client runs
on this one Supabase project, losing access to it takes down every
client simultaneously, and recovering means updating
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` on every
single client's Vercel project, not just one.

## Maintenance habit: backup after every new client

Since this Supabase project has no automatic backups on the free tier,
and every client shares this one project (see blast-radius note above),
run a full backup **after onboarding each new client** (new tenant added,
catalog seeded). Two parts — both needed, a data export alone is not
enough:

1. **Data export** — dump every table as JSON. Query used:
   ```sql
   SELECT json_build_object(
     'tenants', (SELECT jsonb_agg(t) FROM tenants t),
     'store_admins', (SELECT jsonb_agg(t) FROM store_admins t),
     'categories', (SELECT jsonb_agg(t) FROM categories t),
     'products', (SELECT jsonb_agg(t) FROM products t),
     'product_images', (SELECT jsonb_agg(t) FROM product_images t),
     'orders', (SELECT jsonb_agg(t) FROM orders t),
     'contacts', (SELECT jsonb_agg(t) FROM contacts t),
     'hero_slides', (SELECT jsonb_agg(t) FROM hero_slides t),
     'addresses', (SELECT jsonb_agg(t) FROM addresses t),
     'profiles', (SELECT jsonb_agg(t) FROM profiles t),
     'wishlist_items', (SELECT jsonb_agg(t) FROM wishlist_items t)
   ) AS backup;
   ```
2. **Image export** — a data export alone does NOT back up images;
   `image_url` columns are just text pointers into Supabase Storage. Since
   the `images` bucket is public-read, every URL captured in the data
   export can be downloaded directly (no service-role key needed):
   `curl -sSL -o <name> "<image_url>"` for each URL found in
   `categories.image_url`, `products` via `product_images.image_url`, and
   `hero_slides.image_url`.

Both exports are currently a manual, on-request process (ask whoever's
driving the session to run them) — there's no automation for this yet.
Store the resulting files somewhere outside the AI session, since
scratchpad files don't persist once a session ends.

## Per-client setup checklist (for client2, client3, ...)

1. New tenant row: `INSERT INTO tenants (slug, name) VALUES (...)`
2. New admin row: `INSERT INTO store_admins (email, tenant_id) VALUES (...)`
3. New repo clone (same pattern as this one) → new Vercel project
4. Env vars on the new Vercel project:
   - `NEXT_PUBLIC_SUPABASE_URL` (same shared project as this one)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same shared project)
   - `ADMIN_EMAIL` (this client's admin email)
   - `TENANT_ID` (server-only, this client's tenant UUID)
   - `NEXT_PUBLIC_TENANT_ID` (same UUID, public — needed by admin image
     upload forms which run client-side)
5. Rebrand: `app/_lib/siteConfig.js`, `app/_styles/globals.css` color
   tokens, `public/logo.svg` (or replace with a real logo)
6. Seed categories/products for that tenant (SQL, tenant-scoped)
