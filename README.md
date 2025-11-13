# AI SaaS Template

A modern, production-ready AI SaaS template built with Next.js 16, React 19, and TypeScript. This template provides a solid foundation for quickly building and deploying AI-powered SaaS applications.

## Features

- 🚀 **Modern Tech Stack**: Next.js 16 with App Router, React 19, and TypeScript
- 🎨 **Beautiful UI**: shadcn/ui components with Tailwind CSS v4
- 🔐 **Authentication**: Pre-configured Clerk authentication
- 🗄️ **Database**: Supabase integration for data storage
- 📊 **State Management**: TanStack Query for server state
- 🧩 **Component Library**: Reusable UI components with Radix UI primitives
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Authentication**: Clerk
- **Database**: Supabase
- **Icons**: Lucide React
- **Package Manager**: Bun

## Getting Started

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

3. **Run the development server**:
   ```bash
   bun dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Clerk provider
│   ├── page.tsx          # Landing page
│   ├── sign-in/          # Clerk authentication pages
│   └── sign-up/
├── components/            # React components
│   ├── ui/               # shadcn/ui reusable components
│   ├── Header.tsx        # Site navigation
│   ├── Hero.tsx          # Landing page hero section
│   ├── Features.tsx      # Feature showcase
│   └── PricingSection.tsx # Pricing tables
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Development

- **Development server**: `bun dev` (uses Turbopack for faster builds)
- **Build**: `bun build` (creates production build with Turbopack)
- **Start production**: `bun start`
- **Lint**: `bun lint`

## Key Integrations

### Authentication (Clerk)
- Pre-configured sign-in and sign-up pages
- User management and session handling
- Protected routes support

### Database (Supabase)
- PostgreSQL database integration
- Real-time subscriptions
- Row-level security
- **Profile Synchronization**: Automatic sync between Clerk and Supabase



## Customization

This template is designed to be customized for your specific AI SaaS needs:

1. **Update branding**: Modify colors, fonts, and styling in `tailwind.config.js`
2. **Add features**: Extend the landing page components in `components/`
3. **Configure integrations**: Set up your own API keys and endpoints
4. **Add pages**: Create new routes in the `app/` directory

## Profile Synchronization

This template includes automatic profile synchronization between Clerk (authentication) and Supabase (database):

- **Real-time Sync**: When users update their profile through Clerk, changes are automatically synced to Supabase
- **Webhook Integration**: Configure Clerk webhooks to enable real-time sync
- **Manual Sync**: Users can manually sync their profile through the UI
- **Status Indicators**: Visual feedback shows sync status and last sync time

### Setting Up Profile Sync

1. Configure Clerk webhooks in your [Clerk Dashboard](https://dashboard.clerk.com):
   - Add webhook endpoint: `https://your-domain.com/api/clerk-webhooks`
   - Select events: `user.created`, `user.updated`
   - Copy the webhook secret to your environment variables

2. Add webhook secret to `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

For detailed instructions, see [docs/clerk-webhook-setup.md](docs/clerk-webhook-setup.md).

## Deploy

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is open source and available under the [MIT License](LICENSE).
