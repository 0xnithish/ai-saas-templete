# Project Context

## Purpose
This is an AI SaaS template project designed to provide a modern, production-ready foundation for building AI-powered SaaS applications. The template includes authentication, payment processing, database integration, and a beautiful UI to accelerate development of AI SaaS products.

## Tech Stack
- **Frontend Framework**: Next.js 16 with App Router
- **UI Framework**: React 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Authentication**: Clerk (with shadcn theme integration)
- **Database**: Supabase (PostgreSQL)
- **Payment Processing**: Polar (subscription management)
- **State Management**: TanStack Query for server state
- **Icons**: Lucide React
- **Package Manager**: Bun
- **Build Tool**: Turbopack (for faster development and production builds)
- **Additional Libraries**: Motion (animations), Recharts (charts), DND Kit (drag & drop)

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Component Structure**: Functional components with React hooks
- **Styling**: Tailwind CSS with custom utility classes and design tokens
- **Component Libraries**: shadcn/ui pattern with class-variance-authority for variant management
- **File Organization**: Domain-based folder structure (components/ui, components/landing, components/dashboard, etc.)
- **Imports**: Path aliases using `@/` for cleaner imports
- **Naming**: PascalCase for components, camelCase for variables and functions

### Architecture Patterns
- **App Router**: Next.js 16 App Router for routing and layouts
- **Component Composition**: Reusable UI components with Radix UI primitives
- **Server Components**: Leverage Next.js server components where appropriate
- **Client-Side State**: TanStack Query for server state management
- **Theme System**: Dark/light mode support with next-themes
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Testing Strategy
- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript strict mode for compile-time safety
- **Build Verification**: Production builds must pass without errors

### Git Workflow
- **Branching**: Feature branches from main/landing-page
- **Commit Messages**: Conventional commits with descriptive messages
- **Current Branch**: `landing-page` (feature branch for landing page development)

## Domain Context
This is an AI SaaS template project targeting developers who want to quickly build AI-powered software-as-a-service applications. The template provides common SaaS features out of the box:

- User authentication and management
- Subscription billing and payment processing
- Database integration for data persistence
- Responsive landing page with modern UI
- Dashboard components for analytics and user management
- Theme switching (dark/light mode)

## Important Constraints
- **Performance**: Use Turbopack for fast development and production builds
- **Build Requirements**: Do not run build commands unless explicitly requested
- **Package Manager**: Use Bun as the primary package manager
- **Compatibility**: Must support modern browsers with ES2017+ features
- **Security**: Follow Next.js security best practices with Clerk authentication

## External Dependencies
- **Clerk**: Authentication and user management service
- **Supabase**: PostgreSQL database and real-time features
- **Polar**: Payment processing and subscription management
- **Vercel**: Recommended deployment platform (Next.js optimized)
- **Google Fonts**: Inter and JetBrains Mono fonts via Next.js font optimization
