# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `bun install` - Install dependencies (uses Bun as package manager)
- `bun dev` - Start development server with Turbopack (faster builds)
- `bun build` - Create production build with Turbopack
- `bun start` - Start production server
- `bun lint` - Run ESLint

### Specialized Scripts
- `bun run sync:email-theme` - Sync email theme colors from CSS variables (runs automatically before dev/build)

## Architecture Overview

This is a modern AI SaaS template built with Next.js 16 App Router, React 19, and TypeScript. The architecture follows a clean separation of concerns with dedicated directories for components, authentication, database operations, and API routes.

### Key Technologies & Patterns

**Authentication System**: Uses Better Auth with comprehensive session management
- Server config: `lib/auth.ts` - Complete auth setup with email/password, Polar payments integration
- Client config: `lib/auth-client.ts` - React client with optimized session handling
- Custom session provider: `components/auth/SessionProvider.tsx` - Use instead of default useSession for better performance
- Protected routes: `components/auth/ProtectedRoute.tsx`

**Database Integration**: Supabase with Better Auth schema
- Database utilities: `lib/db/` - Supabase client and database helpers
- Migrations: `supabase/migrations/` - Database schema evolution
- Complete schema initialization: `supabase/init.sql` - One-command database setup

**Payment System**: Polar.sh integration with webhook handling
- Polar client: `lib/polar.ts` - Payment processing setup
- Webhook handler: `app/api/polar/webhooks/route.ts` - Subscription lifecycle events
- Subscription management integrated with auth system

**Email System**: React Email components with Resend
- Email templates: `components/emails/` - VerificationEmail.tsx, PasswordResetEmail.tsx
- Theme synchronization: `lib/email-theme.ts` (auto-generated from CSS variables)
- Resend integration in auth configuration

### Project Structure Patterns

**App Router Structure**:
- `app/(auth)/` - Authentication pages with shared layout
- `app/api/auth/` - Better Auth API routes
- `app/dashboard/` - Protected dashboard area
- `app/profile/` - User profile management

**Component Organization**:
- `components/ui/` - shadcn/ui reusable components
- `components/auth/` - Authentication-specific components
- `components/navigation/` - Header, sidebar, navigation components
- `components/landing/` - Landing page sections
- `components/dashboard/` - Dashboard-specific components
- `components/emails/` - React Email templates

**Server Actions**: `lib/actions/` - Database operations and server-side logic

## Development Workflow

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Set up Supabase project and run `supabase/init.sql`
3. Configure auth secrets and optional services (Resend, Polar)

### Database Operations
- Use Better Auth database schema - don't modify user table structure directly
- Server actions in `lib/actions/` for database operations
- Use Supabase service role key for admin operations

### Authentication Development
- Email verification required before account activation
- Polar customer creation happens after email verification
- Session management optimized with cookie caching and database storage
- Use `ProtectedRoute` component for route protection

### Email Template Development
- Edit React Email components in `components/emails/`
- Run `sync:email-theme` to update theme colors from CSS variables
- Email templates automatically use brand colors from `app/globals.css`

### Payment Integration
- Free and Premium subscription tiers configured in Polar
- Webhook events handle subscription lifecycle automatically
- Customer creation linked to email verification process

## Important Implementation Details

### Session Management
- Sessions stored in database with optimized caching strategy
- Cookie cache with 5-minute maxAge and compact strategy
- Fresh session consideration for 5 minutes after activity
- Use optimized session provider for better performance

### Security Considerations
- Service role key required for database operations (not anon key)
- Row-level security configured via Supabase
- CSRF protection via Better Auth
- Environment-based trusted origins configuration

### Performance Optimizations
- Turbopack for faster development builds
- Database connection pooling optimized for serverless
- Session cookie caching to reduce database queries
- Component-level lazy loading where appropriate

### Email Theme Synchronization
The project automatically syncs CSS custom properties from `app/globals.css` to email theme variables in `lib/email-theme.ts`. This ensures brand consistency across the application and email templates. Run manually with `bun run sync:email-theme` or let it run automatically before dev/build commands.