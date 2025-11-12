---
description: Repository Information Overview
alwaysApply: true
---

# AI SaaS Template Information

## Summary
A production-ready AI SaaS template built with Next.js 16, React 19, and TypeScript. Features pre-configured authentication (Clerk), payments (Polar), database (Supabase), and a modern UI component library (shadcn/ui). Designed for rapid development and deployment of AI-powered SaaS applications.

## Structure
- **app/**: Next.js App Router with pages (landing, sign-in/up, dashboard, debug, API routes)
- **components/**: React components organized by feature (auth, dashboard, landing, navigation, shared, theme, ui)
- **hooks/**: Custom React hooks (use-mobile, use-theme)
- **lib/**: Utility functions and configuration (Clerk config, utils)
- **public/**: Static assets (hero images, logo)
- **scripts/**: Setup scripts (dashboard subdomain configuration)

## Language & Runtime
**Language**: TypeScript  
**TypeScript Version**: ^5  
**Node.js**: 20+ (inferred from @types/node@^20)  
**Runtime**: Next.js 16.0.1 with React 19.1.0  
**Package Manager**: Bun (v1.3.1)  
**Build System**: Next.js with Turbopack

## Dependencies
**Main Dependencies**:
- `next@16.0.1` - React framework with App Router
- `react@19.1.0`, `react-dom@19.1.0` - UI library
- `@clerk/nextjs@^6.34.4` - Authentication
- `@supabase/supabase-js@^2.79.0` - Database client
- `@polar-sh/nextjs@^0.7.0` - Payment integration
- `@tanstack/react-query@^5.90.7` - Server state management
- `@tanstack/react-table@^8.21.3` - Table components
- `next-themes@^0.4.6` - Theme management
- `tailwindcss@^4` - Styling framework
- `lucide-react@^0.553.0` - Icon library
- `zod@^4.1.12` - Schema validation
- `motion@^12.23.24` - Animation library
- `recharts@2.15.4` - Charts library

**UI Components** (Radix UI primitives):
- Accordion, Avatar, Checkbox, Dialog, Dropdown Menu, Label, Navigation Menu, Scroll Area, Select, Separator, Slot, Switch, Tabs, Toggle, Tooltip

**Development Dependencies**:
- `typescript@^5` - Type checking
- `eslint@^9` - Code linting
- `@tailwindcss/postcss@^4` - CSS processing
- `@types/node@^20`, `@types/react@^19`, `@types/react-dom@^19` - Type definitions

## Build & Installation
```bash
# Install dependencies
bun install

# Development server (with Turbopack)
bun dev

# Production build (with Turbopack)
bun build

# Start production server
bun start

# Lint code
bun lint
```

## Main Entry Points
**Root Layout**: `app/layout.tsx` - Configures ClerkProvider, ThemeProvider, fonts (Inter, JetBrains Mono)  
**Landing Page**: `app/page.tsx` - Main entry point  
**Authentication**: `app/sign-in/`, `app/sign-up/` - Clerk auth pages  
**Dashboard**: `app/dashboard/` - Protected dashboard area  
**API Routes**: `app/api/` - Backend API endpoints  
**Proxy Configuration**: `proxy.ts` - Subdomain routing setup

## Configuration Files
- **next.config.ts**: Next.js configuration with subdomain support and image optimization
- **tsconfig.json**: TypeScript config (ES2017 target, strict mode, path aliases `@/*`)
- **eslint.config.mjs**: ESLint v9 flat config with TypeScript rules
- **components.json**: shadcn/ui config (New York style, Lucide icons, neutral base color)
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS v4
- **.env.example**: Environment variables template (Clerk keys required)

## Environment Variables
Required:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

## Testing
No testing framework currently configured. To add tests, consider installing Jest or Vitest with React Testing Library.

## Deployment
Optimized for Vercel deployment. Supports subdomain routing for dashboard functionality. Uses Next.js Image optimization with remote patterns configured for `dashboard.website.com`.
