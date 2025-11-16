# 🚀 Quick Setup Guide - AI SaaS Template

Get your SaaS app running in **under 10 minutes**!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Polar.sh account (for payments, optional)

## Step 1: Clone & Install (2 minutes)

```bash
# Clone this template
git clone <your-repo-url> my-saas-app
cd my-saas-app

# Install dependencies
bun install
# or: npm install
```

## Step 2: Database Setup (3 minutes)

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for it to initialize (~2 minutes)

### Run Database Setup
1. In your Supabase dashboard, go to **SQL Editor**
2. Open `supabase/init.sql` from this project
3. **Copy ALL contents** and paste into SQL Editor
4. Click **Run** ✅

That's it! All tables, indexes, and security policies are created.

## Step 3: Environment Variables (2 minutes)

### Copy the template
```bash
cp .env.example .env.local
```

### Fill in your credentials

#### Supabase Credentials
From Supabase Dashboard → **Settings** → **API**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Use service_role, NOT anon key
```

#### Better Auth Secret
Generate a secure secret:
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Add to `.env.local`:
```bash
BETTER_AUTH_SECRET=your-generated-secret
BETTER_AUTH_URL=http://localhost:3000
```

#### Polar.sh (Optional - for payments)
From [polar.sh](https://polar.sh) dashboard:
```bash
POLAR_ACCESS_TOKEN=polar_xxx
POLAR_WEBHOOK_SECRET=whsec_xxx
POLAR_ORGANIZATION_ID=your-org-id
```

## Step 4: Start Development (30 seconds)

```bash
bun dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Step 5: Test Authentication (1 minute)

1. Visit `/sign-up` 
2. Create an account with your email
3. Check Supabase Dashboard → **Table Editor** → `user` table
4. Your user should appear! ✅

## 🎨 Customize Your App

### Update Branding
- Edit `app/layout.tsx` for site metadata
- Replace logo in `public/logo.svg`
- Update colors in `tailwind.config.ts`

### Configure OAuth (Optional)
Add social login in `lib/auth.ts`:
```typescript
import { google, github } from "better-auth/social-providers";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  // ... rest of config
});
```

### Set Up Payments (Polar.sh)
1. Create products in Polar.sh dashboard
2. Copy product IDs to `app/pricing/page.tsx`
3. Webhook handlers are already set up in `app/api/polar/`

## 📁 Project Structure

```
├── app/
│   ├── (auth)/          # Auth pages (sign-in, sign-up, etc.)
│   ├── api/             # API routes (auth, webhooks)
│   ├── dashboard/       # Protected dashboard
│   └── pricing/         # Pricing page
├── components/
│   ├── auth/            # Auth components
│   ├── dashboard/       # Dashboard components
│   └── landing/         # Landing page components
├── lib/
│   ├── auth.ts          # Better Auth config
│   ├── auth-client.ts   # Client-side auth
│   └── db/              # Database utilities
├── supabase/
│   ├── init.sql         # Complete database setup
│   └── migrations/      # Individual migrations (optional)
└── .env.example         # Environment variables template
```

## 🚀 Deploy to Production

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Update Production URLs
In `.env.production`:
```bash
BETTER_AUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

### Configure Webhooks
Update webhook URLs in:
- Polar.sh dashboard → `https://your-app.vercel.app/api/polar/webhook`

## 🛠️ Common Issues

### "Database connection failed"
- ✅ Check service_role key (not anon key)
- ✅ Verify Supabase URL is correct
- ✅ Ensure project is not paused

### "Authentication not working"
- ✅ Set `BETTER_AUTH_SECRET` 
- ✅ Verify `BETTER_AUTH_URL` matches your app URL
- ✅ Clear browser cache and cookies

### "Import errors"
- ✅ Run `bun install` again
- ✅ Delete `node_modules` and reinstall
- ✅ Check Node.js version (18+ required)

## 📚 Learn More

- [Better Auth Docs](https://www.better-auth.com/docs) - Authentication
- [Supabase Docs](https://supabase.com/docs) - Database
- [Polar.sh Docs](https://docs.polar.sh) - Payments
- [Next.js Docs](https://nextjs.org/docs) - Framework

## 💬 Need Help?

- Open an issue on GitHub
- Check the [full documentation](./README.md)

---

**You're all set!** Start building your SaaS app 🚀
