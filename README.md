# saam-s-store-client1

This is a client clone of the `saam-s-store` Next.js template, running
on a shared multi-tenant Supabase backend. It is **not** a generic
Next.js starter — read `CLAUDE.md` before making any changes; it points
to everything else (`CURRENT_BUILD.md`, `FEATURES.md`, `CLIENTS.md`,
`BUSINESS_CONTEXT.md`, `ONBOARDING_WORKFLOW.md`) that explains what this
repo actually is, why it's built this way, and what's in progress.

## Local development

```bash
npm install
npm run dev
```

Requires the env vars listed in `CLIENTS.md` (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_EMAIL`, `TENANT_ID`,
`NEXT_PUBLIC_TENANT_ID`) in a local `.env.local` file.
