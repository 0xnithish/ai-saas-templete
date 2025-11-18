-- ============================================
-- Migration: Polar to Dodo Payments
-- ============================================
-- This migration updates the database schema for Dodo Payments integration
-- by renaming Polar-specific fields to Dodo-specific fields
--
-- Run this after completing the data migration from Polar to Dodo
-- ============================================

-- Add new Dodo customer ID field (temporarily allow both fields)
ALTER TABLE public.user 
  ADD COLUMN IF NOT EXISTS "dodoCustomerId" TEXT;

-- Migrate data from Polar to Dodo customer ID
UPDATE public.user 
SET "dodoCustomerId" = "polarCustomerId"
WHERE "polarCustomerId" IS NOT NULL;

-- Add index for new Dodo field
CREATE INDEX IF NOT EXISTS idx_user_dodo_customer_id ON public.user("dodoCustomerId");

-- Add comments for Dodo fields
COMMENT ON COLUMN public.user."dodoCustomerId" IS 'Dodo customer ID for payment processing';

-- Update RLS policy to reference new field
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.user;
CREATE POLICY IF NOT EXISTS "Service role can update subscriptions"
  ON public.user
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================
-- Update Helper Function
-- ============================================

-- Update has_premium_access function to work with both providers during transition
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user
    WHERE id = user_id
    AND (
      "subscriptionStatus" IN ('active', 'trialing', 'premium')
      OR (
        "subscriptionStatus" IN ('canceled', 'past_due', 'paused')
        AND "subscriptionEndsAt" > NOW()
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Optional: Remove Polar Fields (uncomment after full migration)
-- ============================================

-- Uncomment these lines after you've confirmed the migration is complete
-- and working properly with Dodo Payments

-- ALTER TABLE public.user DROP COLUMN IF EXISTS "polarCustomerId";
-- DROP INDEX IF EXISTS idx_user_polar_customer_id;

-- ============================================
-- Migration Complete
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Dodo Payments migration complete!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Changes made:';
  RAISE NOTICE '   - Added dodoCustomerId column';
  RAISE NOTICE '   - Migrated data from polarCustomerId to dodoCustomerId';
  RAISE NOTICE '   - Added index for dodoCustomerId';
  RAISE NOTICE '   - Updated helper function';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Next steps:';
  RAISE NOTICE '   1. Update application code to use dodoCustomerId';
  RAISE NOTICE '   2. Test all payment flows';
  RAISE NOTICE '   3. Remove Polar dependencies from code';
  RAISE NOTICE '   4. Run the cleanup section in this migration to drop Polar columns';
  RAISE NOTICE '';
END $$;
