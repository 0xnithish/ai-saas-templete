-- ============================================
-- Schema Fixes Migration
-- ============================================
-- Fixes critical issues in the Better Auth + Polar schema:
-- 1. Remove duplicate email from profiles
-- 2. Update RLS policies for Better Auth compatibility
-- 3. Expand subscription status options
-- 4. Add cleanup job for expired tokens
-- ============================================

-- ============================================
-- 1. FIX DATA DUPLICATION
-- ============================================

-- Remove duplicate email column from profiles (use user.email instead)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Add a view to join user email with profiles for convenience
CREATE OR REPLACE VIEW public.profiles_with_email AS
SELECT 
  p.*,
  u.email
FROM public.profiles p
JOIN public.user u ON p.user_id = u.id;

COMMENT ON VIEW public.profiles_with_email IS 'Profiles joined with email from user table to avoid duplication';

-- ============================================
-- 2. FIX RLS POLICIES FOR BETTER AUTH
-- ============================================

-- Drop existing user-level RLS policies (they use auth.uid() which doesn't work with Better Auth)
DROP POLICY IF EXISTS "Users can view own user data" ON public.user;
DROP POLICY IF EXISTS "Users can update own user data" ON public.user;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.session;
DROP POLICY IF EXISTS "Users can view own accounts" ON public.account;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user;

-- Better Auth uses service_role key from backend, so we only need service role policies
-- The existing service role policies are sufficient:
-- - Service role has full access to all tables
-- - Your application code handles authorization

-- Add comment explaining the RLS approach
COMMENT ON TABLE public.user IS 'Better Auth user table - RLS enforced via service_role. Application code handles authorization.';
COMMENT ON TABLE public.profiles IS 'User profiles - RLS enforced via service_role. Application code handles authorization.';

-- ============================================
-- 3. EXPAND SUBSCRIPTION STATUS OPTIONS
-- ============================================

-- Drop existing check constraint
ALTER TABLE public.user DROP CONSTRAINT IF EXISTS user_subscriptionStatus_check;

-- Add expanded subscription statuses
ALTER TABLE public.user 
  ADD CONSTRAINT user_subscriptionStatus_check 
  CHECK ("subscriptionStatus" IN ('free', 'trialing', 'active', 'past_due', 'canceled', 'paused'));

-- Update existing 'premium' to 'active' (if any exist)
UPDATE public.user SET "subscriptionStatus" = 'active' WHERE "subscriptionStatus" = 'premium';

-- Update helper function to use new statuses
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id TEXT)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON COLUMN public.user."subscriptionStatus" IS 'Subscription status: free, trialing, active, past_due, canceled, or paused';

-- ============================================
-- 4. ADD CLEANUP JOB FOR EXPIRED TOKENS
-- ============================================

-- Function to clean up expired sessions and verifications
CREATE OR REPLACE FUNCTION public.cleanup_expired_auth_data()
RETURNS INTEGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.cleanup_expired_auth_data IS 'Deletes expired sessions and verification tokens. Run daily via cron.';

-- Grant execute to service role only
GRANT EXECUTE ON FUNCTION public.cleanup_expired_auth_data TO service_role;

-- NOTE: To schedule automatic cleanup, add this to your Supabase Dashboard > Database > Cron Jobs:
-- SELECT cron.schedule('cleanup-auth-data', '0 2 * * *', 'SELECT public.cleanup_expired_auth_data();');

-- ============================================
-- 5. ADD MISSING INDEXES
-- ============================================

-- Index for subscription end date queries (for grace period checks)
CREATE INDEX IF NOT EXISTS idx_user_subscription_ends_at ON public.user("subscriptionEndsAt") 
WHERE "subscriptionEndsAt" IS NOT NULL;

-- Index for expired session cleanup
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON public.session("expiresAt");

-- Index for expired verification cleanup
CREATE INDEX IF NOT EXISTS idx_verification_expires_at ON public.verification("expiresAt");

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schema fixes applied successfully!';
  RAISE NOTICE '1. Removed duplicate email from profiles table';
  RAISE NOTICE '2. Updated RLS policies for Better Auth';
  RAISE NOTICE '3. Expanded subscription statuses: free, trialing, active, past_due, canceled, paused';
  RAISE NOTICE '4. Added cleanup function for expired tokens';
  RAISE NOTICE '5. Added performance indexes';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  MANUAL STEP REQUIRED:';
  RAISE NOTICE 'To enable automatic token cleanup, run this in SQL Editor:';
  RAISE NOTICE 'SELECT cron.schedule(''cleanup-auth-data'', ''0 2 * * *'', ''SELECT public.cleanup_expired_auth_data();'');';
END $$;
