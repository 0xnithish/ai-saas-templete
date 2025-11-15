# 🚀 AI SaaS Template - Complete Setup Guide

Welcome! This guide will help you set up your AI SaaS application in **under 15 minutes**.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ Node.js 18+ installed
- ✅ Bun installed (`npm install -g bun`)
- ✅ A Supabase account (free tier works!)
- ✅ A Resend account (free tier works!)
- ✅ Git installed

---

## 🎯 Quick Start (5 Steps)

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the template
git clone <your-repo-url> my-saas-app
cd my-saas-app

# Install dependencies
bun install
```

### Step 2: Set Up Supabase (5 minutes)

1. **Create a new project** at [supabase.com](https://supabase.com)
2. **Run the database migration:**
   - Go to SQL Editor in your Supabase dashboard
   - Copy contents from `supabase/migrations/20250115000000_better_auth_schema.sql`
   - Paste and execute

3. **Get your credentials:**
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key
   - Copy `service_role` key (keep this secret!)
   - Go to Settings → Database
   - Copy your database password

### Step 3: Set Up Resend (3 minutes)

1. **Create account** at [resend.com](https://resend.com)
2. **Get API key:**
   - Go to API Keys
   - Create new key
   - Copy the key (starts with `re_`)

3. **Verify domain** (optional for production):
   - Go to Domains
   - Add your domain
   - Add DNS records
   - Wait for verification

   For development, use: `onboarding@resend.dev`

### Step 4: Configure Environment Variables (2 minutes)

Create `.env.local` in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database URL (URL-encode special characters in password!)
# Example: if password is "pass&word", use "pass%26word"
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.your-project.supabase.co:5432/postgres

# Better Auth Configuration
BETTER_AUTH_SECRET=your_random_secret_here  # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend Email Service
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=onboarding@resend.dev  # Or your verified domain email
```

**Generate Better Auth Secret:**
```bash
openssl rand -base64 32
```

**Important:** If your database password contains special characters (`&`, `@`, `#`, etc.), you must URL-encode them:
- `&` → `%26`
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`

### Step 5: Run and Test (3 minutes)

```bash
# Start development server
bun dev

# Open browser
open http://localhost:3000
```

**Test the authentication:**
1. Go to `/sign-up`
2. Create an account
3. Check your email for verification link
4. Click verify
5. Sign in at `/sign-in`
6. Update your profile at `/profile`

---

## 🎨 Customization Guide

### Branding

1. **Update site metadata** in `app/layout.tsx`:
   ```typescript
   export const metadata: Metadata = {
     title: "Your SaaS Name",
     description: "Your SaaS description",
   };
   ```

2. **Update email templates** in `lib/auth.ts`:
   - Customize HTML in `sendVerificationEmail`
   - Customize HTML in `sendResetPassword`

3. **Add your logo**:
   - Replace `public/logo.png`
   - Update references in components

### Styling

- **Colors**: Edit `app/globals.css` to change theme colors
- **Components**: All UI components are in `components/ui/`
- **Fonts**: Configure in `app/layout.tsx`

### Database Schema

To add custom tables:

1. Create a new migration file in `supabase/migrations/`
2. Name it: `YYYYMMDDHHMMSS_your_migration_name.sql`
3. Add your SQL
4. Run via Supabase CLI or dashboard

Example:
```sql
-- supabase/migrations/20250116000000_add_projects_table.sql
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid()::text = user_id);
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `BETTER_AUTH_SECRET` to a strong random value
- [ ] Use production Resend API key
- [ ] Verify your email domain in Resend
- [ ] Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Enable Supabase database backups
- [ ] Set up proper CORS policies
- [ ] Review and test all RLS policies
- [ ] Enable rate limiting (consider adding rate limiting middleware)
- [ ] Set up monitoring and error tracking (e.g., Sentry)

---

## 📦 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables from `.env.local`
   - Deploy!

3. **Update environment variables:**
   - Change `BETTER_AUTH_URL` to your Vercel URL
   - Change `NEXT_PUBLIC_APP_URL` to your Vercel URL

### Other Platforms

This template works with any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Self-hosted with Docker

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up with new account
- [ ] Receive verification email
- [ ] Click verification link
- [ ] Sign in with verified account
- [ ] Update profile information
- [ ] Request password reset
- [ ] Reset password with email link
- [ ] Sign out
- [ ] Sign in with new password
- [ ] Test protected routes (dashboard, profile)
- [ ] Test public routes (home, sign-in, sign-up)

### Automated Testing (Optional)

Add tests using:
- **Unit tests**: Vitest
- **E2E tests**: Playwright
- **Component tests**: Testing Library

---

## 📚 Project Structure

```
ai-saas-template/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth route group (sign-in, sign-up, etc.)
│   ├── api/                 # API routes
│   ├── dashboard/           # Protected dashboard
│   ├── profile/             # User profile pages
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── auth/               # Auth-related components
│   ├── navigation/         # Navigation components
│   ├── profile/            # Profile components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utility functions
│   ├── actions/           # Server actions
│   ├── auth.ts            # Better Auth configuration
│   ├── auth-client.ts     # Better Auth client
│   └── db/                # Database utilities
├── supabase/              # Supabase configuration
│   ├── migrations/        # Database migrations
│   └── README.md          # Supabase setup guide
├── public/                # Static assets
├── .env.local            # Environment variables (create this!)
└── README.md             # Main documentation
```

---

## 🆘 Troubleshooting

### Build Errors

**Error: "Module not found"**
- Solution: Run `bun install` again

**Error: "Database connection failed"**
- Check `DATABASE_URL` is correct
- Verify password is URL-encoded
- Check Supabase project is active

### Authentication Issues

**"Failed to sign up"**
- Check database migration ran successfully
- Verify `BETTER_AUTH_SECRET` is set
- Check Supabase service role key is correct

**"Email not sending"**
- Verify `RESEND_API_KEY` is correct
- Check `EMAIL_FROM` is valid
- For production, verify your domain in Resend

**"Session not persisting"**
- Clear browser cookies
- Check `BETTER_AUTH_URL` matches your domain
- Verify cookies are enabled in browser

### Database Issues

**"Column does not exist"**
- Re-run the database migration
- Check migration file has correct column names (camelCase)

**"Permission denied"**
- Verify RLS policies are set up correctly
- Check service role key is being used for Better Auth

---

## 🎓 Learning Resources

### Better Auth
- [Official Docs](https://www.better-auth.com/docs)
- [GitHub](https://github.com/better-auth/better-auth)

### Next.js
- [Official Docs](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Supabase
- [Official Docs](https://supabase.com/docs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Resend
- [Official Docs](https://resend.com/docs)
- [Email Best Practices](https://resend.com/docs/send-with-nextjs)

---

## 🤝 Contributing

Found a bug or want to contribute? 

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This template is open source and available under the MIT License.

---

## 🎉 You're All Set!

Your AI SaaS application is now ready to build upon. Here are some next steps:

1. **Add your AI features** (OpenAI, Anthropic, etc.)
2. **Implement billing** (Stripe, Paddle, etc.)
3. **Add analytics** (PostHog, Mixpanel, etc.)
4. **Set up monitoring** (Sentry, LogRocket, etc.)
5. **Build your landing page**
6. **Launch and iterate!** 🚀

Need help? Check the documentation or open an issue on GitHub.

**Happy building!** 💪
