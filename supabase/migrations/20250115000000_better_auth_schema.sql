-- ============================================
-- Better Auth Schema for AI SaaS Template
-- ============================================
-- This migration creates all necessary tables for Better Auth authentication
-- including user management, sessions, OAuth accounts, email verification, and user profiles.
--
-- Run this migration on a fresh Supabase project to set up authentication.
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- BETTER AUTH CORE TABLES
-- ============================================

-- User table: Main authentication table
CREATE TABLE IF NOT EXISTS public.user (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" BOOLEAN DEFAULT FALSE NOT NULL,
  name TEXT,
  image TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.user IS 'Better Auth user table - stores core user authentication data';

-- Session table: Manages user sessions
CREATE TABLE IF NOT EXISTS public.session (
  id TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  token TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE
);

COMMENT ON TABLE public.session IS 'Better Auth session table - manages user sessions with 7-day expiry';

-- Account table: Stores OAuth providers and password hashes
CREATE TABLE IF NOT EXISTS public.account (
  id TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
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

COMMENT ON TABLE public.account IS 'Better Auth account table - stores OAuth providers and password hashes';

-- Verification table: Email verification and password reset tokens
CREATE TABLE IF NOT EXISTS public.verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.verification IS 'Better Auth verification table - manages email verification and password reset tokens';

-- ============================================
-- USER PROFILES TABLE
-- ============================================

-- Profiles table: Extended user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.profiles IS 'User profiles - extended user data beyond authentication';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Better Auth table indexes
CREATE INDEX IF NOT EXISTS idx_session_user_id ON public.session("userId");
CREATE INDEX IF NOT EXISTS idx_session_token ON public.session(token);
CREATE INDEX IF NOT EXISTS idx_account_user_id ON public.account("userId");
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON public.verification(identifier);

-- Profile table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ============================================

-- Function to automatically update the updatedAt timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for Better Auth tables
CREATE TRIGGER handle_user_updated_at
  BEFORE UPDATE ON public.user
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_session_updated_at
  BEFORE UPDATE ON public.session
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_account_updated_at
  BEFORE UPDATE ON public.account
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_verification_updated_at
  BEFORE UPDATE ON public.verification
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for profiles table
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User table policies
CREATE POLICY "Users can view own user data" ON public.user
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own user data" ON public.user
  FOR UPDATE USING (auth.uid()::text = id);

-- Session table policies
CREATE POLICY "Users can view own sessions" ON public.session
  FOR SELECT USING (auth.uid()::text = "userId");

-- Account table policies
CREATE POLICY "Users can view own accounts" ON public.account
  FOR SELECT USING (auth.uid()::text = "userId");

-- Profiles table policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Service role policies (for Better Auth server operations)
CREATE POLICY "Service role has full access to user" ON public.user
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to session" ON public.session
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to account" ON public.account
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to verification" ON public.verification
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to profiles" ON public.profiles
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Log successful migration
DO $$
BEGIN
  RAISE NOTICE 'Better Auth schema migration completed successfully!';
  RAISE NOTICE 'Tables created: user, session, account, verification, profiles';
  RAISE NOTICE 'RLS policies enabled on all tables';
  RAISE NOTICE 'Indexes created for optimal performance';
END $$;
