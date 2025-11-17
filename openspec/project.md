# Project Context

## Purpose
AI SaaS Template is a production-ready starter kit for building AI-powered SaaS products.

Primary goals:
- Provide a modern, opinionated baseline for auth, billing, and core SaaS flows.
- Let teams focus on AI features (LLM tools, dashboards, workflows) instead of boilerplate.
- Be easy to clone, configure, and deploy to Vercel with minimal setup.

## Tech Stack
- **Framework**: Next.js 16 (App Router, server components enabled via shadcn `rsc: true`).
- **Language**: TypeScript (TS 5, `strict: true`).
- **Runtime / Package Manager**: Node 18+, Bun (preferred) or npm.
- **UI**:
  - React 19.
  - Tailwind CSS v4.
  - shadcn/ui (New York style) on top of Radix UI primitives.
  - Icon set: Lucide React, Tabler Icons.
- **State / Data fetching**: TanStack Query for server state.
- **Auth**:
  - Better Auth (core `better-auth` + `@polar-sh/better-auth` + `@polar-sh/nextjs`).
  - Email/password auth with verification and password reset.
- **Database / Backend**:
  - Supabase (PostgreSQL) with SQL schema in `supabase/init.sql` and migrations.
  - `pg` and `@supabase/supabase-js` for database access where needed.
- **Payments**: Polar for subscriptions, checkout, webhooks, and customer portal.
- **Email**: Resend for transactional emails (verification, password reset, etc.).
- **Tooling**:
  - ESLint 9 with TypeScript plugin and Next.js config.
  - Turbopack for dev/build (`next dev --turbopack`, `next build --turbopack`).
  - Path aliases via TSConfig (`@/*` → workspace root).

## Project Conventions

### Code Style
- **TypeScript-first**: All new code should be `.ts`/`.tsx` with `strict` mode enabled.
- **React components**:
  - Functional components and React hooks.
  - Prefer server components by default; use client components only when needed (stateful UI, browser-only APIs).
- **Styling**:
  - Tailwind utility classes for layout and visual styling.
  - Shared UI primitives live in `components/ui` (shadcn-generated) and should be reused instead of re-implementing.
- **Naming / organization**:
  - Feature-oriented folders under `app/` (`sign-in/`, `dashboard/`, `pricing/`, etc.).
  - Shared logic in `lib/` (e.g., `lib/auth.ts`, `lib/db`, `lib/actions`).
  - Use path aliases (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`).
- **Linting rules (high level)**:
  - `@typescript-eslint/no-unused-vars` enforced (unused args must be prefixed with `_`).
  - `@typescript-eslint/no-explicit-any` and `no-non-null-assertion` are warnings.
  - `no-console` as warning, `no-debugger` as error, `prefer-const` and `no-var` as errors.

### Architecture Patterns
- **Next.js App Router**
  - Routing and layouts live under `app/`.
  - API routes (auth, webhooks, etc.) are under `app/api/*`.
- **Authentication boundary**
  - Better Auth server config in `lib/auth.ts` and client helpers in `lib/auth-client.ts`.
  - Auth API routes under `app/api/auth/`.
  - Protected routes like `app/dashboard/` rely on Better Auth sessions.
- **Data access**
  - Supabase SQL schema lives in `supabase/init.sql` with optional migrations under `supabase/migrations/`.
  - Database utilities and connection logic under `lib/db/`.
- **Server actions / business logic**
  - Server actions grouped under `lib/actions/`.
  - API handlers and actions keep domain logic in shared helpers where possible.
- **UI composition**
  - Reusable UI in `components/ui` and feature-specific UI in folders like `components/auth`, `components/dashboard`, `components/landing`, etc.
- **Deployment targets**
  - Primary deployment is Vercel (see `vercel.json`).
  - Turbopack is used for dev and production builds.

### Testing Strategy
- No dedicated automated test framework is wired up yet (no Jest/Vitest/Playwright in dependencies).
- Current expectations:
  - Rely on Next.js dev server, manual flows, and Supabase console checks during early development.
  - Validate auth flows (sign up, verify email, sign in, password reset) manually.
  - Validate subscription lifecycle using Polar’s test environment and webhooks.
- Future work (recommended):
  - Add unit tests (e.g., Vitest) for critical auth and billing logic.
  - Add end-to-end tests (e.g., Playwright) for sign-in, dashboard, and billing flows before production hardening.

### Git Workflow
- Intended usage is as a template repo you clone and adapt.
- Recommended workflow for teams using this template:
  - `main` is always deployable to production.
  - Feature work on short-lived branches (e.g., `feature/add-pricing-page`, `fix/reset-password-bug`).
  - Use pull requests for review before merging to `main`.
  - Optional but recommended: conventional commit messages (e.g., `feat: add team billing page`, `fix: handle expired reset tokens`).

## Domain Context
- This codebase is not a specific product but a **generic AI SaaS starter**.
- Common use cases:
  - AI-powered dashboards, tools, and workflows behind authentication.
  - Subscription-based products with free and paid tiers.
  - Apps that need email-based onboarding and lifecycle messaging.
- Core domain concepts baked into the template:
  - **User accounts** with profile data stored in Supabase.
  - **Authentication sessions** managed by Better Auth.
  - **Subscriptions and plans** handled via Polar (Free vs Premium, etc.).
  - **Emails** (verification, reset) sent through Resend.

## Important Constraints
- **Runtime / environment**:
  - Requires Node.js 18+.
  - Designed and tested primarily for deployment on Vercel.
- **Database**:
  - Assumes a Supabase PostgreSQL instance configured via `supabase/init.sql`.
  - Uses row-level security (RLS) as configured in the SQL.
- **Configuration**:
  - `.env.local` (and production env) must provide Supabase, Better Auth, Resend, and Polar secrets.
  - `BETTER_AUTH_URL` must match the app’s externally reachable URL (localhost in dev, Vercel URL in prod).
- **Auth & security**:
  - Better Auth secret must be cryptographically strong (see `SETUP.md` for generation instructions).
  - Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or client-side code.
- **Performance and complexity**:
  - Prefer simple, single-service architecture (Next.js app + Supabase + Polar + Resend).
  - Avoid introducing additional services or microservices until clearly justified.

## External Dependencies
- **Supabase**
  - PostgreSQL database, auth-related tables, and RLS.
  - Managed via `supabase/init.sql` and optional migrations.
- **Better Auth**
  - Core authentication, session management, and email-based flows.
  - Integrated via `better-auth`, `@polar-sh/better-auth`, and `@polar-sh/nextjs`.
- **Polar**
  - Subscription and billing platform.
  - Used for checkout, subscription lifecycle events (via webhooks), and customer portal.
- **Resend**
  - Transactional email provider for verification and password reset emails.
- **Vercel**
  - Primary hosting/deployment target (see `vercel.json` and README deploy section).
- **Other libraries**
  - Radix UI primitives (via various `@radix-ui/react-*` packages).
  - Lucide React and Tabler Icons for iconography.
  - DnD Kit, Recharts, Motion, etc., for drag-and-drop, charts, and animation in the UI.
