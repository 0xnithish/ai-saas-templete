-- ============================================
-- AI SaaS Template - Complete Database Setup
-- ============================================
-- Single-file database initialization for Better Auth + Polar.sh
-- 
-- USAGE:
-- 1. Copy this entire file
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run
-- 4. Done! All tables, indexes, and policies will be created
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE AUTHENTICATION TABLES (Better Auth)
-- ============================================

-- User table: Main authentication and subscription data
CREATE TABLE IF NOT EXISTS public.user (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" BOOLEAN DEFAULT FALSE NOT NULL,
  name TEXT,
  image TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Polar.sh subscription fields
  "polarCustomerId" TEXT,
  "subscriptionStatus" TEXT DEFAULT 'free'::text CHECK ("subscriptionStatus" = ANY (ARRAY['free'::text, 'trialing'::text, 'active'::text, 'past_due'::text, 'canceled'::text, 'paused'::text])),
  "subscriptionEndsAt" TIMESTAMPTZ
);

COMMENT ON TABLE public.user IS 'Better Auth user table - RLS enforced via service_role. Application code handles authorization.';
COMMENT ON COLUMN public.user."polarCustomerId" IS 'Polar customer ID for payment processing';
COMMENT ON COLUMN public.user."subscriptionStatus" IS 'Subscription status: free, trialing, active, past_due, canceled, or paused';
COMMENT ON COLUMN public.user."subscriptionEndsAt" IS 'Timestamp when canceled subscription ends (for grace period access)';

-- Session table: Manages user sessions
CREATE TABLE IF NOT EXISTS public.session (
  id TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  token TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL
);

COMMENT ON TABLE public.session IS 'Better Auth session table';

-- Account table: Stores OAuth providers and password hashes
CREATE TABLE IF NOT EXISTS public.account (
  id TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  scope TEXT,
  password TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.account IS 'Better Auth account table for OAuth';

-- Verification table: Email verification and password reset tokens
CREATE TABLE IF NOT EXISTS public.verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.verification IS 'Better Auth verification table';

-- Profiles table: Extended user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.profiles IS 'User profiles - RLS enforced via service_role. Application code handles authorization.';

-- ============================================
-- FOREIGN KEY CONSTRAINTS (with CASCADE)
-- ============================================

ALTER TABLE public.session 
  DROP CONSTRAINT IF EXISTS session_userid_fkey,
  ADD CONSTRAINT session_userid_fkey 
  FOREIGN KEY ("userId") REFERENCES public.user(id) ON DELETE CASCADE;

ALTER TABLE public.account 
  DROP CONSTRAINT IF EXISTS account_userid_fkey,
  ADD CONSTRAINT account_userid_fkey 
  FOREIGN KEY ("userId") REFERENCES public.user(id) ON DELETE CASCADE;

ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_user_id_fkey,
  ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user(id) ON DELETE CASCADE;

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_user_subscription_status ON public.user("subscriptionStatus");
CREATE INDEX IF NOT EXISTS idx_user_polar_customer_id ON public.user("polarCustomerId");
CREATE INDEX IF NOT EXISTS idx_user_subscription_ends_at ON public.user("subscriptionEndsAt") WHERE "subscriptionEndsAt" IS NOT NULL;

-- Session table indexes
CREATE INDEX IF NOT EXISTS idx_session_user_id ON public.session("userId");
CREATE INDEX IF NOT EXISTS idx_session_token ON public.session(token);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON public.session("expiresAt");

-- Account table indexes
CREATE INDEX IF NOT EXISTS idx_account_user_id ON public.account("userId");

-- Verification table indexes
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON public.verification(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_expires_at ON public.verification("expiresAt");

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGERS
-- ============================================

-- Function to automatically update updatedAt/updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create triggers for Better Auth tables
DROP TRIGGER IF EXISTS handle_user_updated_at ON public.user;
CREATE TRIGGER handle_user_updated_at
  BEFORE UPDATE ON public.user
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS handle_session_updated_at ON public.session;
CREATE TRIGGER handle_session_updated_at
  BEFORE UPDATE ON public.session
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS handle_account_updated_at ON public.account;
CREATE TRIGGER handle_account_updated_at
  BEFORE UPDATE ON public.account
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS handle_verification_updated_at ON public.verification;
CREATE TRIGGER handle_verification_updated_at
  BEFORE UPDATE ON public.verification
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for profiles table
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profiles_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role has full access to user" ON public.user;
DROP POLICY IF EXISTS "Service role has full access to session" ON public.session;
DROP POLICY IF EXISTS "Service role has full access to account" ON public.account;
DROP POLICY IF EXISTS "Service role has full access to verification" ON public.verification;
DROP POLICY IF EXISTS "Service role has full access to profiles" ON public.profiles;

-- Create optimized service role policies (Better Auth uses service_role key)
CREATE POLICY "Service role has full access to user" 
ON public.user FOR ALL TO public
USING ((select auth.role()) = 'service_role'::text);

CREATE POLICY "Service role has full access to session" 
ON public.session FOR ALL TO public
USING ((select auth.role()) = 'service_role'::text);

CREATE POLICY "Service role has full access to account" 
ON public.account FOR ALL TO public
USING ((select auth.role()) = 'service_role'::text);

CREATE POLICY "Service role has full access to verification" 
ON public.verification FOR ALL TO public
USING ((select auth.role()) = 'service_role'::text);

CREATE POLICY "Service role has full access to profiles" 
ON public.profiles FOR ALL TO public
USING ((select auth.role()) = 'service_role'::text);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if user has active premium access
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user
    WHERE id = user_id
    AND (
      "subscriptionStatus" IN ('active', 'trialing')
      OR (
        "subscriptionStatus" IN ('canceled', 'past_due', 'paused')
        AND "subscriptionEndsAt" > NOW()
      )
    )
  );
END;
$$;

COMMENT ON FUNCTION public.has_premium_access IS 'Check if user has active premium access (including canceled subscriptions in grace period)';
GRANT EXECUTE ON FUNCTION public.has_premium_access TO authenticated;

-- Cleanup expired sessions and verification tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_auth_data()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete expired sessions
  DELETE FROM public.session WHERE "expiresAt" < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Delete expired verifications
  DELETE FROM public.verification WHERE "expiresAt" < NOW();
  GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION public.cleanup_expired_auth_data IS 'Deletes expired sessions and verification tokens. Run daily via cron.';
GRANT EXECUTE ON FUNCTION public.cleanup_expired_auth_data TO service_role;

-- ============================================
-- HELPFUL VIEW
-- ============================================

-- View to easily access profile + email data
CREATE OR REPLACE VIEW public.profiles_with_email AS
SELECT 
  p.*,
  u.email,
  u."subscriptionStatus",
  u."subscriptionEndsAt"
FROM public.profiles p
JOIN public.user u ON p.user_id = u.id;

COMMENT ON VIEW public.profiles_with_email IS 'Profiles joined with user data for convenience';

-- ============================================
-- INITIALIZATION COMPLETE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Database initialization complete!';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Tables created:';
  RAISE NOTICE '   - user (with Polar.sh subscription fields)';
  RAISE NOTICE '   - session';
  RAISE NOTICE '   - account';
  RAISE NOTICE '   - verification';
  RAISE NOTICE '   - profiles';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Features enabled:';
  RAISE NOTICE '   - Row Level Security (RLS)';
  RAISE NOTICE '   - Auto-updating timestamps';
  RAISE NOTICE '   - CASCADE delete on user removal';
  RAISE NOTICE '   - Performance indexes';
  RAISE NOTICE '   - Helper functions';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '   1. Copy your Supabase service_role key';
  RAISE NOTICE '   2. Update .env.local with database credentials';
  RAISE NOTICE '   3. Configure Better Auth in lib/auth.ts';
  RAISE NOTICE '   4. Test authentication flows';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Optional: Schedule automatic cleanup (run in SQL Editor):';
  RAISE NOTICE '   SELECT cron.schedule(';
  RAISE NOTICE '     ''cleanup-auth-data'',';
  RAISE NOTICE '     ''0 2 * * *'',';
  RAISE NOTICE '     ''SELECT public.cleanup_expired_auth_data();''';
  RAISE NOTICE '   );';
  RAISE NOTICE '';
END $$;
