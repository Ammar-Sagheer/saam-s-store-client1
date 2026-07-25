# PROJECT_CONTEXT.md — saamj-store

> ⚠️ **This file describes the original saamj-store template, before this
> repo was cloned and converted into a multi-tenant client site.** It's
> kept for historical background on the original architecture/decisions,
> but it does **not** reflect this repo's current state — customer
> accounts/wishlist are disconnected, the chat widget is removed, the
> database is a shared multi-tenant Supabase project instead of a
> dedicated one, etc.
>
> **For this repo's actual current state, read `FEATURES.md` instead** —
> that's the primary source of truth going forward. Paste `FEATURES.md`
> into a new AI conversation to continue development on this repo.

---

## 1. Project Overview

**saamj-store** is a full-stack e-commerce storefront that clones **saamjllc.com** (SAAMJ LLC, a real store based in Middletown, CT selling everyday products: baby care, grocery, hardware, pet care, etc.).

- Built by **Ammar**, a developer learning web development after completing Jonas Schmedtmann's "Ultimate React Course" (Udemy). This is his **first independent project from scratch**, intended as an Upwork freelancing portfolio piece.
- **Workflow convention:** Ammar writes all code himself; the AI gives step-by-step directions, explains styling/concepts in plain English when asked, and gives full-file rewrites once a component has been through many rounds of diffs. Confirm changes worked before moving to the next item. **New this session:** feature work is done on dedicated git branches (`feature/...`), tested, then merged into `main` — branches are sometimes kept alive across multiple merges rather than deleted immediately.
- **Long-term strategy:** reusable template. Future clients get a clone with rebranded colors/logo/content + a fresh Supabase project.

**Live deployment:** https://saam-s-store.vercel.app/
**Real site being cloned:** https://saamjllc.com/

## 2. Project Goals

1. Pixel-faithful clone of saamjllc.com.
2. Fully functional storefront: browse, filter, search, cart, checkout (manual payment), order confirmation.
3. **Customer accounts** (NEW this session): Google OAuth login, saved addresses with checkout autofill, order history, profile settings, wishlist — guest checkout remains fully supported.
4. Full admin panel behind login, now hardened against the new customer-auth surface (see §19).
5. Mobile-responsive everywhere with dedicated mobile UX.
6. Dark mode across the entire admin panel.
7. Portfolio-quality code, now including proper static caching (see §18).

## 3. Current Project Status

- ✅ Storefront: complete and polished.
- ✅ Admin panel: complete, dark mode + bulk CSV import.
- ✅ **Customer accounts: complete and merged to main.** Google OAuth login/logout, order history via `user_id`, checkout prefill (Google name/email + full saved-address autofill), saved addresses (multiple, with default), profile settings, dedicated paginated Orders page, wishlist, navbar avatar.
- ✅ **Security hardening completed this session** — see §19.
- ✅ **Root-cause fix for broken static caching** — see §18.
- 🔄 Not started: persistent server-side cart for logged-in users (still localStorage-only) — see §23.
- ❗ Merged to `main` and pushed — do one full click-through on production before considering fully closed, since OAuth redirects/cookies can behave differently than localhost.

## 4. Overall Architecture

```
Browser
  ├── Store (public + customer-authenticated)
  │     └── Cart = React Context + localStorage (NOT account-synced yet)
  │     └── Mutations = Server Actions (actions.js)
  │
  ├── Customer auth (NEW)
  │     ├── /account, /orders, /addresses, /settings, /wishlist — each a
  │     │     server component checking createSupabaseServer().auth.getUser();
  │     │     renders <AccountLoginPrompt /> if no user
  │     ├── /auth/callback/route.js — exchanges OAuth code for session,
  │     │     redirects to `next` param
  │     └── AccountLoginPrompt uses usePathname() to pass `next` so login
  │           returns user to originating page, not always /account
  │
  ├── /admin (protected) — TWO LAYERS now (see §19):
  │     ├── middleware.js → session check + x-pathname header
  │     ├── admin/layout.js → checks `!user || user.email !== ADMIN_EMAIL`
  │     └── EVERY admin Server Action also calls requireAdmin(supabase)
  │
  └── Supabase: Postgres (RLS everywhere, 3 new customer tables), Auth
        (admin: email/password; customers: Google OAuth — SAME auth.users
        table, distinguished only by email match), Storage
```

**Critical rules, reaffirmed/hardened this session:**
1. Anything reading RLS-protected data or mutating must use `createSupabaseServer()`, never the anon client. (`deleteProductAction` was found using the wrong client again — recurring bug class, audit every new action.)
2. **"Authenticated" no longer means "admin."** Before this session the only session was the admin's. Now any customer can be `authenticated` via Google. Every admin-only action/policy MUST explicitly check identity.

## 5. Tech Stack

Same as before, plus: `papaparse` (bulk import), `@supabase/ssr` now also used directly in `app/auth/callback/route.js`. JS only, no TypeScript, no shadcn.

## 6. Folder Structure (key changes only)

```
app/
├── layout.js                 ← REWORKED: no longer calls headers() at all.
│                                Just <AppChrome>{children}</AppChrome> + Toaster.
├── _components/layout/
│   └── AppChrome.js           ← NEW client component, usePathname() instead
│                                of headers() — the caching fix (§18)
├── auth/callback/route.js     ← NEW Route Handler, OAuth code exchange
├── _components/account/       ← NEW FOLDER:
│     AccountLoginPrompt.js  AccountDashboard.js
│     AddressList.js  AddressForm.js  SettingsForm.js
├── _lib/actions.js            ← requireAdmin() helper + applied everywhere;
│                                user_id in placeOrder; address/profile/
│                                wishlist actions
├── account/page.js  orders/page.js  addresses/page.js  settings/page.js
│     wishlist/page.js         ← ALL REWRITTEN from static "coming soon"
│                                to real functionality
└── admin/layout.js            ← auth check hardened, see §19
```
`next.config.mjs` remotePatterns gained `lh3.googleusercontent.com` (Google avatars). `ProductCard.js` gained the wishlist heart button. `checkout/page.js` significantly extended (see §12/§14).

## 7. Database Schema

Existing tables unchanged except **`orders` gained `user_id UUID REFERENCES auth.users(id)`** (nullable, NULL for guests).

### New tables

```sql
addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  label VARCHAR(100),
  first_name, last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city, state VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(255) DEFAULT 'United States',
  is_default BOOLEAN DEFAULT false,   -- app-enforced uniqueness only, see §14
  created_at TIMESTAMPTZ DEFAULT NOW()
)

profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name VARCHAR(255),
  phone VARCHAR(50),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

wishlist_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
)
```

### RLS — full current state

| Table | public/anon | authenticated customer (`auth.uid()=user_id`) | admin only (email-matched) |
|---|---|---|---|
| categories/products/product_images | SELECT | — | INSERT/UPDATE/DELETE |
| orders | INSERT, SELECT* | SELECT own (`Users can view their own orders`) | UPDATE |
| contacts | INSERT | — | SELECT, DELETE |
| addresses/profiles/wishlist_items (NEW) | — | full CRUD, own only | — |

\* `orders` still has the legacy public `USING(true)` SELECT policy (`"Allow read own orders"`) — needed for guest order-confirmation, but technically lets anyone read any order by id. **Deliberately deferred per Ammar's decision** — see §19/§23/§24.

**Found and DROPPED this session:** `"Allow authenticated read orders"` (SELECT, any authenticated, zero restriction) — let ANY logged-in customer read every order's full PII with a normal query, no exploit needed. This became live/exploitable the moment Google login existed. Canonical example of why "authenticated ≠ admin" matters.

## 8. Auth Flow

**Two identities, one Supabase Auth system.** Admin: email/password at `/admin/login`. Customer: Google OAuth via `AccountLoginPrompt` → `/auth/callback` (exchanges code) → back to originating page via `next` param. Both share `auth.users`; distinguished ONLY by `user.email === process.env.ADMIN_EMAIL`, checked explicitly everywhere it matters. No role column — deliberate simplicity tradeoff for single-admin project, but means the email-check pattern must be manually copied into any future admin-only surface.

**Google OAuth setup (dashboards, not code):** Google Cloud Console OAuth consent screen (External/Testing) + Client ID with JS origins (prod + localhost) and redirect URI (`https://<project-ref>.supabase.co/auth/v1/callback`); Supabase → Auth → Providers → Google enabled with Client ID/Secret; Supabase → Auth → URL Configuration with Site URL + both wildcard redirect URLs.

## 9. API Routes

`app/auth/callback/route.js` (GET) — the only Route Handler. Everything else is Server Actions.

### Server Actions — current full list

| Action | Auth check |
|---|---|
| `placeOrder` | none (guest-allowed), attaches `user_id` if logged in |
| `submitContactForm` | none |
| `createProductAction`/`updateProductAction`/`deleteProductAction`/`bulkImportProducts` | **`requireAdmin()`** |
| `createCategoryAction`/`updateCategoryAction`/`deleteCategoryAction` | **`requireAdmin()`** |
| `updateOrderStatusAction`/`deleteMessageAction` | **`requireAdmin()`** |
| `createAddressAction`/`updateAddressAction`/`deleteAddressAction` (NEW) | `auth.uid()` match, code + RLS |
| `upsertProfileAction` (NEW) | logged-in user |
| `toggleWishlistAction(productId)` (NEW) | logged-in user, returns `{added: boolean}` |

```js
async function requireAdmin(supabaseServer) {
  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) throw new Error("Unauthorized.");
}
```

## 10. State Management

Cart/Recently Viewed unchanged. **New pattern — "key-reset" trick:** for saved-address autofill in checkout, uncontrolled inputs get `key={`field-${selectedAddressId}`}` so React remounts (re-reading `defaultValue`) when the selected address changes, while staying editable afterward. Cheaper than converting the form to controlled inputs — **reuse this pattern for future "select saved thing, autofill fields" UI.**

## 11. Styling Approach

Unchanged. Toaster in root layout lost its `isAdminRoute` conditional styling (root layout no longer reads pathname) — now one consistent compact style everywhere. Would need to move into `AppChrome.js` if admin-specific toast styling is wanted back.

## 12. UI Component Architecture

- **Navbar**: tracks auth via `onAuthStateChange()`, shows Google avatar (rounded `next/image`, `sizes="28px"`) instead of `UserIcon` when logged in.
- **ProductCard**: wishlist heart button, `z-30` (had to be above the `z-20` add-to-cart hover overlay or clicks fell through to the product link). Low-stock badge nudged to `top-10` to avoid overlap. `e.preventDefault(); e.stopPropagation()` since the card is a `<Link>`.
- **checkout/page.js**: saved-address selector drives the key-reset autofill; user+addresses fetch merged into the existing `mounted` gate. **Every input/select needed explicit `w-full`** — none had it, which was fine until the longer address-selector option text caused content-based sizing to overflow on mobile and force an OS zoom-out. Add `w-full` to all future form fields by default.

## 13. Admin Panel Architecture

Unchanged structurally. Hardened this session — see §19.

## 14. Important Business Logic

- `placeOrder` attaches `user_id` if logged in, `null` for guests — guest path fully preserved.
- **"Default address" uniqueness is app-code enforced only** (manual `UPDATE ... SET is_default=false` before setting a new default), NOT a DB constraint — a bypass could produce duplicate defaults.
- Checkout prefill: Google name/email always; saved default address (if any) fills phone/address/city/state/zip/country on top.
- Wishlist toggle backed by a DB `UNIQUE(user_id, product_id)` constraint as a race-condition guard, on top of the existing-row check in the action.

## 15. Environment Variables

Unchanged names. **`ADMIN_EMAIL` is now load-bearing for security** (used in `requireAdmin()` and `admin/layout.js`) — confirm correctly set in Vercel.

## 16. Coding & Naming Conventions

Unchanged. Reaffirmed: prefer full-file rewrites over diffs once a file has many rounds of changes.

## 17. Reusable Utilities & Helpers

Unchanged, plus `<Pagination>` now reused directly on customer-facing `/orders`.

## 18. Performance Optimizations Implemented

**Major fix — root cause of broken static caching:** root `app/layout.js` called `headers()` on every request just to read `x-pathname` for chrome-splitting. In App Router, `headers()`/`cookies()` anywhere in a layout forces that whole segment (and everything nested) dynamic — disabling static generation/ISR/Full Route Cache app-wide, regardless of `revalidate` on individual pages. Undetectable in `npm run dev` (caching is always off there). Symptom: every navigation showed a skeleton flash in **production** specifically.

**Fix:** moved chrome-splitting to `AppChrome.js`, a client component using `usePathname()` (doesn't force dynamic rendering). Root layout is now a plain cacheable server component.

**Follow-on fix:** once static prerendering could actually run, `/_not-found`'s build-time prerender surfaced that `Navbar.js`'s `useSearchParams()` had no `<Suspense>` boundary (previously masked by the forced-dynamic layout skipping this check). Fixed by wrapping `<Navbar />` in `<Suspense>` inside `AppChrome.js`.

Tested via dedicated branch + `npm run build && npm start` (required, since dev mode can't reveal caching regressions) before merging.

**Second fix — hydration mismatches from cart localStorage**, three spots (Navbar badge, cart page, checkout page empty-cart branches): server always renders "empty cart" (no localStorage access); a returning visitor's real non-empty cart populates client-side after mount, causing a genuine mismatch, not just a flash. Fixed uniformly with a `mounted` boolean gate — render a neutral loading state until `mounted`, then swap to real cart state as a normal update. **Required pattern for any future cart-dependent conditional UI.**

## 19. Security Considerations

**Major hardening pass, triggered by Ammar asking "do our server actions have authorization checks too?"** — caught a real gap: before this session `authenticated` could only mean "the admin"; Google login broke that assumption silently.

**Found and fixed:**
1. `deleteProductAction` again using the anon client instead of `createSupabaseServer()` — silent no-op delete, toast falsely reported success. Fixed.
2. `requireAdmin()` added to every admin-only Server Action (see §9).
3. RLS on categories/products/product_images/contacts (INSERT/UPDATE/DELETE) and orders (UPDATE) tightened from "any authenticated" to admin-email-matched.
4. **Dropped a genuinely dangerous policy**: `"Allow authenticated read orders"` let any logged-in customer read every order's full PII, no restriction at all. See §7.
5. `admin/layout.js` widened from `if (!user)` to `if (!user || user.email !== process.env.ADMIN_EMAIL)` — previously a logged-in customer could view the full admin dashboard shell even though mutations would fail.
6. **Verified live** via incognito + a genuinely different Google account, confirming `/admin` redirects correctly.

**Deliberately deferred (not forgotten):** the legacy public `"Allow read own orders"` policy on `orders` — needed for guest order-confirmation, but lets anyone read any order by id. Should eventually move behind a scoped RPC. Ammar's explicit call to leave as-is for now.

## 20. SEO Considerations

Unchanged.

## 21. Completed Features

**Storefront/Admin:** unchanged from prior handoff, plus this session's security hardening (§19).

**Customer Accounts (entirely new this session):** Google OAuth login/logout; `/account` dashboard (quick-links, 3 recent orders + View All); `/orders` full paginated history; `/addresses` full CRUD with default selection; `/settings` name/phone editing; `/wishlist` heart-button toggle on every `ProductCard` + dedicated listing page; checkout prefill + saved-address autofill; navbar avatar; security hardening; static caching root-cause fix; three hydration-mismatch fixes.

## 22. In Progress

Nothing — this session's full scope is complete, tested directly by Ammar, merged to `main`, pushed.

## 23. Remaining Features / Next Steps (priority order)

1. **Persistent server-side cart for logged-in users** — needs a `cart_items` table, `CartContext` rewrite (sync for logged-in, localStorage fallback for guests), and a **guest-cart-merge-on-login strategy decision** (real product decision, discuss with Ammar first).
2. Tighten the legacy public `orders` SELECT policy — move guest lookups behind a scoped RPC.
3. Full deliberate production click-through of the customer-accounts flow (OAuth, autofill, order history) — tested locally/briefly on prod, not exhaustively logged.
4. DB-level constraint (partial unique index) for "one default address per user" instead of app-code-only enforcement.
5. Continue general styling polish (ongoing).
6. Uninstall unused Stripe packages.
7. Payment gateway (Paymob/HBL/PayFast) — later, for a real client.

## 24. Known Bugs & Tech Debt

- Next 16 middleware→proxy deprecation warning — accepted, do not retry migrating.
- ESLint `react-hooks/set-state-in-effect` warnings — known, accepted.
- **Legacy public `"Allow read own orders"` policy** — real, currently-exploitable PII exposure by order id, explicitly deprioritized by Ammar.
- "Default address" uniqueness is app-code only, not DB-enforced.
- Cart not yet account-synced — known, planned gap.
- Test/placeholder category data still present (content cleanup, not code).
- Unused Stripe packages not yet uninstalled.
- No exhaustive production click-through logged for this session's features yet.

## 25. Key Design Decisions & Reasoning (do not silently reverse)

Items 1–16 from prior handoffs unchanged.

**New this session:**

17. **"Authenticated" ≠ "admin," everywhere, from now on.** Every admin-only RLS policy and Server Action must independently verify `email === ADMIN_EMAIL`. No structural role-column enforcement exists — this is a deliberate simplicity tradeoff, but means the checklist must be manually applied to any new admin-only feature.
18. **Never call `headers()`/`cookies()` in a layout/page that doesn't strictly need per-request dynamic data.** Silently disabled static caching app-wide for an unknown period, undetectable in dev mode. Prefer a client component with `usePathname()` for pathname-based UI branching.
19. **Any UI reading `CartContext`'s cart state and branching render output needs the `mounted`-gate pattern** to avoid hydration mismatches — required, not optional, for future cart-dependent UI.
20. **The `key={...}`-reset trick is the preferred solution for "select a saved option, autofill uncontrolled fields"** — reuse rather than re-deriving.
21. Feature branches for anything nontrivial, tested (including `npm run build && npm start` specifically for caching-related changes), then merged — sometimes kept alive across multiple merges before final cleanup.
