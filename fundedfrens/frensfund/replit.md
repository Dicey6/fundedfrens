# FundedFrens

A funded trading challenge platform where traders prove their skills on a demo account, then receive a funded trading account upon approval.

## Run & Operate

- `pnpm --filter @workspace/fundedfrens run dev` — run the frontend (Vite dev server)
- `pnpm --filter @workspace/fundedfrens run typecheck` — typecheck the frontend
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (already set)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui
- Auth + DB: Supabase (no custom backend — frontend communicates directly with Supabase)
- Routing: wouter
- Forms: react-hook-form + zod
- Animations: framer-motion

## Where things live

- `artifacts/fundedfrens/src/` — all frontend code
- `artifacts/fundedfrens/src/lib/supabase.ts` — Supabase client + TypeScript types
- `artifacts/fundedfrens/src/contexts/AuthContext.tsx` — auth state, session, profile
- `artifacts/fundedfrens/src/pages/` — Login, Signup, ForgotPassword, ResetPassword, Dashboard, Profile
- `supabase/migration.sql` — complete SQL migration to run in Supabase SQL Editor

## Architecture decisions

- Pure Supabase frontend: no Express/Node backend. All data and auth goes through Supabase directly.
- Profile auto-created via Supabase database trigger on `auth.users` INSERT.
- Unique referral codes and Telegram link codes generated in the trigger using `gen_random_uuid()`.
- RLS enabled on all tables — users can only access their own records.
- Funded account section is architecture-ready but visually locked until challenge_status = 'approved'.

## Product

- Phase 1: Auth (signup/login/forgot/reset), auto profile creation, dashboard with 11 data-driven cards, referral system, Telegram linking, notifications.
- Phase 2 (not built): funded account functionality, challenge purchases, trading analytics.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `supabase/migration.sql` in your Supabase SQL Editor before testing signups — the trigger that auto-creates profiles must exist first.
- Supabase anon key is a public key (designed to be in browser code) — stored as VITE_ env var.
- Email verification is enabled by default in Supabase — new signups must verify email before logging in.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
