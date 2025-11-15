# Project Context

## Purpose
AI SaaS Template is a modern, production-ready template for building AI-powered SaaS applications. It provides a solid foundation with authentication, database integration, and a beautiful UI, allowing developers to quickly scaffold and deploy AI SaaS products.

## Tech Stack
- **Frontend Framework**: Next.js 16 with App Router
- **UI Library**: React 19 with TypeScript 5
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (New York style) built on Radix UI primitives
- **Authentication**: Better Auth (modern alternative to Clerk/NextAuth)
- **Email Service**: Resend for transactional emails
- **Database**: Supabase (PostgreSQL) with Row-Level Security
- **State Management**: TanStack Query for server state
- **Package Manager**: Bun with Turbopack for fast builds
- **Icons**: Lucide React and Tabler Icons
- **Additional Libraries**: 
  - Zod for schema validation
  - Motion for animations
  - DnD Kit for drag and drop
  - Recharts for data visualization

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled with full type safety
- **ESLint**: Configured with TypeScript-specific rules
- **Naming**: 
  - Components: PascalCase
  - Files: kebab-case for utilities, PascalCase for components
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
- **Imports**: Use absolute paths with `@/` prefix configured in tsconfig.json
- **File Organization**: Feature-based structure with co-located components, hooks, and utilities

### Architecture Patterns
- **App Router**: Leveraging Next.js 16 App Router for better performance and streaming
- **Server Components**: Using React Server Components by default
- **Client Components**: Marked with "use client" directive when interactivity is needed
- **Server Actions**: Using Next.js server actions for mutations and form handling
- **Database**: Supabase with PostgreSQL, following database-as-code approach with migrations
- **Authentication**: Better Auth with session-based authentication stored in database

### Testing Strategy
- **Linting**: ESLint with TypeScript support for code quality
- **Type Checking**: TypeScript strict mode for catching type errors
- **Build Validation**: Production builds must pass without errors
- **Manual Testing**: Focus on user flows and integration testing

### Git Workflow
- **Main Branch**: `main` for production-ready code
- **Development Branch**: `qa` for current development work
- **Commit Convention**: Conventional commits with prefixes (feat:, fix:, docs:, etc.)
- **Pull Requests**: Required for merging to main branch

## Domain Context
This is an AI SaaS template designed for:
- Rapid prototyping of AI-powered applications
- Subscription-based SaaS products
- Applications requiring user authentication and data persistence
- Projects needing a modern, responsive UI with accessibility features

## Important Constraints
- **Performance**: Must maintain high performance scores (Core Web Vitals)
- **Security**: Row-Level Security enabled in Supabase, secure session management
- **Accessibility**: WCAG 2.1 AA compliance required
- **Mobile-First**: Responsive design optimized for mobile devices
- **SEO**: Server-side rendering for better SEO performance

## External Dependencies
- **Supabase**: Database, authentication, and storage service
- **Resend**: Email delivery service for transactional emails
- **Vercel**: Recommended deployment platform (though not required)
- **GitHub**: Code repository and CI/CD platform
