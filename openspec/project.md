# Project Context

## Purpose
A modern, production-ready AI SaaS template built with Next.js 16, React 19, and TypeScript. This template provides a solid foundation for quickly building and deploying AI-powered SaaS applications with authentication, payments, email services, and database integration out of the box.

## Tech Stack
- **Frontend Framework**: Next.js 16 with App Router and Turbopack
- **UI Library**: React 19 with TypeScript 5
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (New York style) built on Radix UI primitives
- **Authentication**: Better Auth with email/password and email verification
- **Payments**: Polar.sh integration for subscriptions and checkout
- **Email Service**: Resend for transactional emails
- **Database**: Supabase (PostgreSQL) with Row-Level Security
- **State Management**: TanStack Query for server state
- **Icons**: Lucide React
- **Package Manager**: Bun
- **Build Tool**: Turbopack (Next.js 16)
- **Linting**: ESLint with TypeScript support

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled, prefer explicit types over `any`
- **ESLint**: Configured with TypeScript rules, warns on `no-explicit-any` and `no-non-null-assertion`
- **Naming**: 
  - Components: PascalCase (e.g., `AuthForm.tsx`)
  - Files: kebab-case for utilities (e.g., `auth-client.ts`)
  - Variables: camelCase
- **Imports**: Use absolute imports with `@/` prefix for internal modules
- **Unused Variables**: Prefix with underscore (`_`) to suppress ESLint warnings
- **Console**: Prefer proper logging, `console.log` warnings in ESLint

### Architecture Patterns
- **App Router**: Next.js 16 App Router with Server Components by default
- **Client Components**: Use `"use client";` directive for interactive components
- **Authentication Flow**:
  - Server-side auth configuration in `lib/auth.ts`
  - Client-side auth hooks in `lib/auth-client.ts`
  - Protected routes using Better Auth middleware
- **Database**: Direct PostgreSQL queries via `pg` library (no ORM)
- **API Routes**: RESTful endpoints in `app/api/` directory
- **Component Organization**:
  - `components/ui/` - Reusable shadcn/ui components
  - `components/auth/` - Authentication-specific components
  - `components/landing/` - Landing page sections
  - `components/dashboard/` - Dashboard-specific components

### Testing Strategy
- No testing framework currently configured
- Recommended: Jest for unit tests, Playwright for E2E tests
- Manual testing through development server

### Git Workflow
- **Main Branch**: `main` for production-ready code
- **Development**: Feature branches from `main`
- **Commit Convention**: Conventional Commits recommended (not enforced)
- **Ignore Patterns**: `.next/`, `node_modules/`, build artifacts

## Domain Context
This is an AI SaaS template designed for rapid development of subscription-based software applications. Key domain concepts:
- **User Management**: Email verification, password reset, profile management
- **Subscription Tiers**: Free and Premium plans via Polar.sh
- **Authentication**: Session-based auth with 7-day expiration
- **Email Communications**: Transactional emails for verification and password resets
- **Database Schema**: User profiles with subscription status and Polar customer integration

## Important Constraints
- **Serverless Environment**: Database connections limited to max 1 pool connection
- **Environment Variables**: Must be configured for all external services
- **Security**: Use service_role keys for database operations, not anon keys
- **SSL Required**: Database connections must use SSL (Supabase requirement)
- **Email Service**: Resend API key required for email functionality
- **Payment Integration**: Polar.sh tokens required for subscription features

## External Dependencies
- **Supabase**: PostgreSQL database hosting and authentication
- **Polar.sh**: Payment processing and subscription management
- **Resend**: Email delivery service
- **Better Auth**: Authentication framework
- **Vercel**: Recommended deployment platform (Next.js optimized)
