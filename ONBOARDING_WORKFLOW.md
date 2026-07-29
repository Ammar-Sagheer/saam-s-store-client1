# New Client Onboarding — Workflow

The full agreed process for onboarding a new client, start to finish.
A visual version of this exists as a published artifact, but **this file
is the durable source of truth** — any future AI session reads this
automatically via `CLAUDE.md`; the artifact link is just for humans to
glance at.

## Phase 1 — Domain & account setup (repeats per client)

1. **Middle person buys the domain** (+ business email if wanted) at
   Hostinger. Domain registration only — no hosting plan needed anymore.
2. **Middle person gives a fresh email** for this client — a different
   one each time, used only to create this client's Vercel account.
3. **Create a new Vercel account** with that email. New browser profile
   + different network for the signup. Log in via **email**, not GitHub
   OAuth — never connect GitHub to this account. Vercel login stays
   with you, not handed to the client.

## Phase 2 — Build the site (repeats per client)

4. **Clone the template locally** in VS Code — copy from the existing
   template code, not a GitHub fork/connect for this specific client.
5. **Add the tenant to the shared Supabase project**: new row in
   `tenants` + `store_admins`, and create the admin auth user
   (email + password) for this client. Supabase access is never shared
   with anyone outside you — it's shared across every client, so one
   leak risks all of them.
6. **Rebrand & seed the catalog**: colors, name, logo, plus at least
   2 products per category — sourced via AliExpress/Alibaba (use the
   URL-suffix trick for full resolution) or AI-generated, bulk-imported
   via the admin panel's CSV import.

## Phase 3 — Deploy & connect (repeats per client)

7. **Deploy via CLI**: `vercel --prod`, direct upload from local, no
   GitHub link. Add the 5 env vars: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_EMAIL`, `TENANT_ID`,
   `NEXT_PUBLIC_TENANT_ID`.
8. **Middle person does a one-time nameserver switch** at Hostinger to
   Vercel's nameservers — two fixed values, same every time, he never
   touches DNS again after this.
9. **Attach the domain in Vercel, test everything**: admin login, guest
   checkout, order tracking, hero images, no broken links.

## Phase 4 — Wrap up (repeats per client)

10. **Update the tracking docs**: add the new row to `CLIENTS.md`,
    reset `CURRENT_BUILD.md` back to "no build in progress."
11. **Run a backup**: data export AND image export, both — not just one.

## Who gets what

**Hand to the middle person / client:**
- The live site URL / their domain
- Admin panel login (email + password)

**Never shared, ever:**
- Supabase project credentials (shared across all clients — one leak risks everyone)
- The Vercel account login (kept for the rare future redeploy)
- Your GitHub account

## One-time setup, not repeated per client

The shared Supabase project (multi-tenant, RLS-scoped), the template
codebase, and this whole documented process — `CLAUDE.md`,
`FEATURES.md`, `BUSINESS_CONTEXT.md` in this repo.

---

*Visual version: [New Client Onboarding — Workflow Map](https://claude.ai/code/artifact/b9826518-bd51-46bf-a4cf-0a978717cd54)
— nice to glance at, but this markdown file is what actually gets read
automatically by future AI sessions.*
