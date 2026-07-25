# Current Build — pick up here

This file tracks whatever client is *actively being built right now*,
step by step, so either of us (or a fresh AI session, a week later) can
see exactly what's done and what's left without reconstructing it from
chat history. `CLIENTS.md` only gets a new row once a client is
**fully finished** — this file is the in-between state.

**Read this file FIRST, before `FEATURES.md` or `CLIENTS.md`,** whenever
starting a session — it tells you whether there's unfinished work and
exactly where it stopped.

---

## Status: No build currently in progress

Client1 (Oman and Alam) is complete and recorded in `CLIENTS.md`.
When client2 (or any new client) starts, fill in the section below,
check items off as they're done, and update "Last updated" every time
something changes — don't let this go stale mid-build.

---

## Template — copy this in when starting a new client

```
## Status: IN PROGRESS — building <client name>

Last updated: <date>
Started: <date>

### Checklist

**Backend**
- [ ] New tenant row created (slug: ___, UUID: ___)
- [ ] store_admins row created (admin email: ___)
- [ ] Admin auth user created in Supabase dashboard (matching email above)

**Repo + hosting**
- [ ] New private GitHub repo created (name: ___)
- [ ] Code cloned from client1 (chat widget removed, account/wishlist
      disconnected — should already be true if cloned from this repo)
- [ ] New Vercel project created (name: ___)
- [ ] Env vars set on Vercel: NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY, ADMIN_EMAIL, TENANT_ID,
      NEXT_PUBLIC_TENANT_ID

**Rebrand**
- [ ] siteConfig.js — name, tagline, contact/bank details (real or
      clearly-fake placeholders, never TODO markers left visible)
- [ ] Color palette in globals.css
- [ ] Logo

**Content**
- [ ] Categories seeded
- [ ] Products seeded
- [ ] Hero banner slide(s) added via /admin/hero

**Testing**
- [ ] Admin login works
- [ ] Guest checkout works end-to-end
- [ ] Order shows up in /admin/orders
- [ ] Order tracking (/track-order) works
- [ ] Homepage/shop/product pages render correctly, no broken images

**Domain (if applicable)**
- [ ] Domain purchased
- [ ] Nameservers or DNS records pointed at Vercel
- [ ] Domain attached in Vercel, SSL issued

**Wrap-up**
- [ ] CLIENTS.md updated with final row
- [ ] FEATURES.md updated if anything architectural changed
- [ ] Backup run (data export + image export)
- [ ] This file reset back to "No build currently in progress"

### Notes / open questions
(anything blocking, decisions still pending, things to double-check)
```
