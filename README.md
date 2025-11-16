# AI SaaS Template

A modern, production-ready AI SaaS template built with Next.js 16, React 19, and TypeScript. This template provides a solid foundation for quickly building and deploying AI-powered SaaS applications.

## Features

- 🚀 **Modern Tech Stack**: Next.js 16 with App Router, React 19, and TypeScript
- 🎨 **Beautiful UI**: shadcn/ui components with Tailwind CSS v4
- 🔐 **Authentication**: Better Auth with email/password and email verification
- 💳 **Payments**: Polar integration for subscriptions and checkout
- 📧 **Email Service**: Resend integration for transactional emails
- 🗄️ **Database**: Supabase integration for data storage
- 📊 **State Management**: TanStack Query for server state
- 🧩 **Component Library**: Reusable UI components with Radix UI primitives
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Authentication**: Better Auth
- **Payments**: Polar
- **Email Service**: Resend
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Package Manager**: Bun

## 🚀 Quick Start

**New to this template? See [SETUP.md](./SETUP.md) for step-by-step instructions!**

### TL;DR

```bash
# 1. Install dependencies
bun install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Set up database (one-time)
# - Go to Supabase Dashboard → SQL Editor
# - Copy & paste entire supabase/init.sql file
# - Run it ✅

# 4. Fill in .env.local with your credentials
# - Supabase URL and service_role key
# - Generate BETTER_AUTH_SECRET with: openssl rand -base64 32

# 5. Start development
bun dev
```

Open [http://localhost:3000](http://localhost:3000) and you're ready to go! 🎉

## Detailed Setup

### 1. Install Dependencies
```bash
bun install
# or: npm install
```

### 2. Database Setup (Supabase)
**One file = Complete setup** ✨

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your dashboard
3. Copy **ALL contents** of `supabase/init.sql`
4. Paste and **Run**

That's it! All tables, indexes, and security are configured.

### 3. Environment Variables
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials (from Dashboard → Settings → API):
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (⚠️ use service_role, not anon key)
- `BETTER_AUTH_SECRET` (generate with: `openssl rand -base64 32`)

### 4. Optional Services

**Email (Resend)**:
- Sign up at [resend.com](https://resend.com)
- Add `RESEND_API_KEY` to `.env.local`

**Payments (Polar.sh)**:
- Create account at [polar.sh](https://polar.sh)
- Add `POLAR_ACCESS_TOKEN` and product IDs to `.env.local`

### 5. Start Development
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── api/auth/          # Better Auth API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Landing page
│   ├── sign-in/          # Authentication pages
│   ├── sign-up/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── profile/          # User profile page
│   └── dashboard/        # Dashboard page
├── components/            # React components
│   ├── ui/               # shadcn/ui reusable components
│   ├── auth/             # Authentication components
│   ├── navigation/       # Navigation components
│   ├── profile/          # Profile management
│   └── landing/          # Landing page sections
├── lib/                  # Utility functions
│   ├── auth.ts           # Better Auth server config
│   ├── auth-client.ts    # Better Auth client config
│   ├── actions/          # Server actions
│   └── db/               # Database utilities
├── supabase/migrations/  # Database migrations
└── public/               # Static assets
```

## Development

- **Development server**: `bun dev` (uses Turbopack for faster builds)
- **Build**: `bun build` (creates production build with Turbopack)
- **Start production**: `bun start`
- **Lint**: `bun lint`

## Key Integrations

### Authentication (Better Auth)
- Email/password authentication with verification
- Password reset functionality
- Session management with database storage
- Protected routes support
- Customizable email templates

### Email Service (Resend)
- Transactional email delivery
- Email verification
- Password reset emails
- Custom branded templates

### Database (Supabase)
- PostgreSQL database integration
- Row-level security (RLS)
- User profiles and session storage
- Real-time capabilities

### Payments (Polar)
- Subscription management (Free and Premium tiers)
- Hosted checkout integration
- Webhook event handling for subscription lifecycle
- Customer portal for self-service subscription management
- Automatic customer creation on signup
- Secure payment processing

## Authentication Features

### Sign Up Flow
1. User enters email, password, and name
2. Account is created with unverified email
3. Verification email is sent via Resend
4. User clicks verification link
5. Email is verified and user can sign in

### Password Reset Flow
1. User requests password reset
2. Reset email is sent via Resend
3. User clicks reset link
4. User enters new password
5. Password is updated and user can sign in

### Profile Management
- Update first name, last name, and username
- View profile status and metadata
- Automatic profile creation on first sign-in

## Customization

This template is designed to be customized for your specific AI SaaS needs:

1. **Update branding**: Modify colors, fonts, and styling in `tailwind.config.js`
2. **Customize emails**: Edit email templates in `lib/auth.ts`
3. **Add features**: Extend components in `components/`
4. **Configure integrations**: Set up your own API keys and endpoints
5. **Add pages**: Create new routes in the `app/` directory
6. **Extend authentication**: Add OAuth providers via Better Auth plugins

## Deploy

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is open source and available under the [MIT License](LICENSE).
