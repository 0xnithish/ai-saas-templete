# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI SaaS template built with Next.js 16, React 19, and TypeScript. The project uses modern web development tools and follows a component-based architecture with shadcn/ui for the design system.

## Development Commands

- **Development server**: `bun dev` (uses Turbopack for faster builds)
- **Build**: `bun build` (creates production build with Turbopack)
- **Start production**: `bun start`
- **Lint**: `bun lint`

Note: The project uses Bun as the package manager.

## Architecture & Tech Stack

### Core Technologies
- **Next.js 16** with App Router and React 19
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library (New York style)

### Authentication & Integration
- **Clerk** for authentication (configured in `app/layout.tsx`)
- **Supabase** for database operations
- **Polar** for payment/subscription management
- **TanStack Query** for server state management

### UI Components
- Uses Radix UI primitives with custom shadcn/ui components
- Components located in `components/ui/` for reusable UI elements
- Landing page components in `components/` directory
- Lucide React for icons

### Project Structure
```
app/                    # Next.js App Router pages
├── layout.tsx         # Root layout with Clerk provider
├── page.tsx          # Landing page
├── sign-in/          # Clerk authentication pages
└── sign-up/

components/            # React components
├── ui/               # shadcn/ui reusable components
├── Header.tsx        # Site navigation
├── Hero.tsx          # Landing page hero section
├── Features.tsx      # Feature showcase
├── PricingSection.tsx # Pricing tables
└── [other landing page sections]

lib/                  # Utility functions
└── utils.ts          # Tailwind utility (cn function)

public/               # Static assets
```

## Key Configuration

### Environment Variables
Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### Path Aliases
The project uses `@/*` alias for imports from the root directory, configured in `tsconfig.json`.

### Component Library
shadcn/ui is configured with:
- Style: New York
- RSC: Enabled
- CSS variables: Enabled
- Base color: Neutral
- Icon library: Lucide React

## Development Notes

### Authentication Flow
The app uses Clerk for authentication with pre-built sign-in and sign-up pages at `/sign-in` and `/sign-up`.

### Styling Approach
- Uses Tailwind CSS with CSS variables for theming
- Components follow the shadcn/ui pattern with variants using class-variance-authority
- Utility function `cn()` combines clsx and tailwind-merge for conditional classes

### Component Architecture
- Landing page is composed of multiple section components (Hero, Features, Pricing, etc.)
- Each section is self-contained and reusable
- UI components in `components/ui/` are generic and reusable across the app