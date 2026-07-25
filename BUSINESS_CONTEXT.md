# Business Context

This explains *why* this project exists and *why* it's built this way —
not covered by `FEATURES.md` (the technical state) or `CLIENTS.md` (the
client registry). Read this to understand the purpose behind past
architecture decisions, not just what they are.

## What this actually is

Ammar builds cloned, rebranded storefront websites for a **middle
person**, who in turn sells them to **Amazon sellers**. These sites are
**not real e-commerce stores** — they're "proof of business" websites:
something an Amazon seller can point to as evidence their business has a
web presence, not a site meant to process real customer orders at scale
or attract organic traffic. Guest checkout and order tracking exist and
work, but the sites are dummy/low-traffic by design, not a growth
product.

The middle person previously handled this entirely through WordPress on
Hostinger — buying hosting + a domain per client, handing over a
`wp-admin` login. He is not technical. This project moves that same
handoff experience (client gets a URL + an admin panel login) onto a
Next.js + Vercel + Supabase stack instead, for cost, security, and
reliability reasons — see the cost/tradeoff discussion below.

## Why the architecture looks the way it does

- **One shared Supabase project, multi-tenant (`tenant_id` + RLS), not
  one project per client.** Supabase's free tier caps an account at 2
  active free projects — nowhere near enough for 10+ clients. A shared
  project with proper tenant scoping is what makes this affordable at
  scale (see "Cost" below). The real cost of this choice: it's a single
  point of failure across every client at once (see `FEATURES.md`'s
  disaster recovery section).
- **Vercel Pro, one project per client** (not shared). Hobby/free tier
  explicitly disallows commercial use and risks account suspension —
  bad when 10 client sites share one account. Pro is a flat $20/mo
  regardless of client count, so unlike Supabase, per-client Vercel
  projects don't need to be shared to stay affordable.
- **Chat widget removed entirely** (not just disabled). It called an
  external agent backend that isn't tenant-aware — would have leaked
  one client's product data into another client's chat answers under
  the shared-DB setup. Also just unnecessary for a proof-of-business
  site.
- **Customer accounts / Google OAuth / wishlist disconnected, not
  deleted.** These dummy sites don't need real customer logins — nobody
  evaluating "does this business have a website" is going to test
  account creation. Kept in the codebase (see `FEATURES.md`) rather than
  deleted, in case a specific client ever wants real accounts. Notably,
  Google flags unverified OAuth apps with a "hasn't been verified"
  warning to visitors — a real risk of undermining the exact legitimacy
  these sites exist to project, not just unnecessary complexity.
- **Hero banner made admin-editable** (not in the original template).
  Was previously hardcoded in code, requiring a redeploy per client to
  change a banner image — now each client manages their own via
  `/admin/hero`, same tenant-scoped pattern as everything else.

## Domain/DNS handoff with the middle person

He is non-technical and previously only ever bought hosting + domains as
a bundle on Hostinger. The agreed workflow: he buys the domain only (no
hosting needed anymore — that's the pitch), does a **one-time nameserver
switch** to Vercel's nameservers (two fixed values, always the same,
no DNS record concepts he needs to understand), and never touches DNS
again for that domain. Everything else — actual records, SSL, future
changes — happens on Ammar's side via the Vercel dashboard. No Hostinger
login is ever shared in either direction.

## The cost pitch (why this beats WordPress for this business)

- WordPress/Hostinger: roughly $8–11/month in hosting **per client**,
  cost scaling linearly with client count.
- This stack: a flat ~$20–45/month total (Vercel Pro + optional Supabase
  Pro), regardless of how many clients are on it — marginal cost per
  additional client is close to $0.
- The middle person also stops paying for hosting entirely — he only
  ever buys the domain now.
- Non-cost wins: no WordPress plugin-hack risk, no plugin-update
  maintenance burden, faster page loads (Vercel edge vs. budget shared
  hosting).
- Honest tradeoffs, not just upside: he loses the ability to poke around
  himself the way `wp-admin` allowed; every custom feature request now
  routes through Ammar instead of an instant WordPress plugin; bus-factor
  risk is higher since this is a custom codebase, not something any
  WordPress freelancer could pick up.

## Known risks worth remembering

- **Single shared Supabase project = single point of failure.** Losing
  it takes down every client simultaneously, and recovery requires
  updating env vars on every single client's Vercel project, not just
  one. Mitigated by `supabase/disaster_recovery.sql` (structure) — data
  loss is still real without regular backups (see `FEATURES.md`).
- **Supabase free-tier auto-pause after ~7 days of no API activity.**
  Genuinely dangerous for a low-traffic dummy site — the worst moment
  for a database to be paused is exactly when someone (e.g. an Amazon
  reviewer) finally checks the site. **Not yet mitigated** — see
  "Planned work" below.
- **Mass-produced templated sites can read as spam/abuse** to platform
  trust & safety systems (Vercel, Supabase, even Amazon's own review of
  the seller). Worth keeping content/design varied enough per client
  that they don't look like an obvious template farm.

## Planned work — not yet implemented

- **Automatic keep-alive ping** for the shared Supabase project, to
  prevent the free-tier auto-pause described above. Plan discussed:
  a scheduled ping (e.g. a cron job hitting the Supabase REST API every
  3–4 days, safely under the 7-day pause window) rather than relying on
  manual visits. **Not built yet** — deprioritized while there's no
  active client to protect uptime for. Build this before onboarding
  client2, or sooner if client1's site needs to stay reliably up.
