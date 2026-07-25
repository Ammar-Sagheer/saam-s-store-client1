# Feature Status — saam-s-store-client1

This repo is a clone of the `saam-s-store` template, adapted to run as one
tenant in a **shared multi-tenant Supabase project** used for dummy
proof-of-business storefronts (not real e-commerce). This file tracks what
the original template had, what's active here, and what was deliberately
turned off — so a future session (or future-you) doesn't have to
re-derive it from the diff.

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
