# Client Registry

Authoritative record of every client running on the shared multi-tenant
Supabase project. If you (or a future AI session) forget a tenant UUID,
admin email, or which Vercel project maps to which client — it's here,
not just in someone's memory or a chat transcript.

**Update this file every time a new client is onboarded** (new tenant row
created) — see the checklist in `FEATURES.md`.

Shared backend for every row below:
- Supabase project: `saam-store-client1` (ref `siwosrjmbrgoautfmzfy`), org "Ammar Org"
- `NEXT_PUBLIC_SUPABASE_URL`: `https://siwosrjmbrgoautfmzfy.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: see Supabase dashboard → Settings → API (not duplicated here since it doesn't change per client)

| Client | Tenant slug | Tenant UUID (= `TENANT_ID` = `NEXT_PUBLIC_TENANT_ID`) | Admin email (`ADMIN_EMAIL`) | Repo | Vercel project | Domain |
|---|---|---|---|---|---|---|
| Client1 (Oman and Alam) | `client1` | `708a55c7-d622-41fd-92d9-d8bc7847b36c` | `testemail@gmail.com` | `Ammar-Sagheer/saam-s-store-client1` | `saam-s-store-client1` (live at `saam-s-store-client1.vercel.app`) | _TBD — custom domain not yet purchased/attached_ |

## Env vars per client, for reference

Every client's Vercel project needs exactly these 4, plus the 2 shared ones above:
- `ADMIN_EMAIL` — that client's admin login email
- `TENANT_ID` — that client's tenant UUID (server-only)
- `NEXT_PUBLIC_TENANT_ID` — same UUID, public (needed by admin image-upload forms, which run client-side)
