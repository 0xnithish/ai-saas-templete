-- ============================================
-- Better Auth Performance Index Migration
-- ============================================
-- This migration adds performance indexes recommended by Better Auth
-- to optimize database queries for authentication operations.

-- ============================================
-- CORE AUTH TABLE INDEXES
-- ============================================

-- User table email index (for login and verification lookups)
CREATE INDEX IF NOT EXISTS idx_user_email 
ON public.user(email);

-- Session table indexes (for session validation)
CREATE INDEX IF NOT EXISTS idx_session_user_id 
ON public.session("userId");
CREATE INDEX IF NOT EXISTS idx_session_token 
ON public.session(token);

-- Account table indexes (for OAuth and password lookups)
CREATE INDEX IF NOT EXISTS idx_account_user_id 
ON public.account("userId");

-- Verification table index (for email verification and password reset)
CREATE INDEX IF NOT EXISTS idx_verification_identifier 
ON public.verification(identifier);

-- ============================================
-- COMPOSITE INDEXES FOR COMMON QUERIES
-- ============================================

-- Composite index for session validation (userId + expiresAt)
CREATE INDEX IF NOT EXISTS idx_session_user_expires 
ON public.session("userId", "expiresAt");

-- Composite index for active sessions (expiresAt + userId)
CREATE INDEX IF NOT EXISTS idx_session_active 
ON public.session("expiresAt");

-- Composite index for account lookups (userId + providerId)
CREATE INDEX IF NOT EXISTS idx_account_user_provider 
ON public.account("userId", "providerId");

-- ============================================
-- PARTIAL INDEXES FOR OPTIMIZED PERFORMANCE
-- ============================================

-- Partial index for verified users only
CREATE INDEX IF NOT EXISTS idx_user_verified 
ON public.user(email) WHERE "emailVerified" = TRUE;

-- ============================================
-- INDEX STATISTICS UPDATE
-- ============================================

-- Update statistics for better query planning
ANALYZE public.user;
ANALYZE public.session;
ANALYZE public.account;
ANALYZE public.verification;
ANALYZE public.profiles;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Log successful migration
DO $$
BEGIN
  RAISE NOTICE 'Better Auth performance index migration completed successfully!';
  RAISE NOTICE 'Indexes created for: user.email, session.userId, session.token, account.userId, verification.identifier';
  RAISE NOTICE 'Composite indexes added for common query patterns';
  RAISE NOTICE 'Partial indexes added for optimized performance';
  RAISE NOTICE 'Statistics updated for improved query planning';
END $$;
