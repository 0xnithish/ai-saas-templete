-- ============================================
-- Polar Payments Integration Migration
-- ============================================
-- This migration adds Polar-related fields to the user table
-- for subscription management and customer tracking.
--
-- Run this after the Better Auth schema migration.
-- ============================================

-- Add Polar customer and subscription fields to user table
ALTER TABLE public.user 
  ADD COLUMN IF NOT EXISTS "polarCustomerId" TEXT,
  ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT DEFAULT 'free' CHECK ("subscriptionStatus" IN ('free', 'premium', 'canceled')),
  ADD COLUMN IF NOT EXISTS "subscriptionEndsAt" TIMESTAMPTZ;

-- Add index for faster subscription status queries
CREATE INDEX IF NOT EXISTS idx_user_subscription_status ON public.user("subscriptionStatus");
CREATE INDEX IF NOT EXISTS idx_user_polar_customer_id ON public.user("polarCustomerId");

-- Add comments for documentation
COMMENT ON COLUMN public.user."polarCustomerId" IS 'Polar customer ID for payment processing';
COMMENT ON COLUMN public.user."subscriptionStatus" IS 'Current subscription tier: free, premium, or canceled';
COMMENT ON COLUMN public.user."subscriptionEndsAt" IS 'Timestamp when canceled subscription ends (for grace period access)';

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- Enable RLS on user table if not already enabled
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own subscription status
CREATE POLICY IF NOT EXISTS "Users can view own subscription"
  ON public.user
  FOR SELECT
  USING (auth.uid()::text = id);

-- Policy: Only service role can update subscription status (for webhooks)
-- Note: Webhook handlers should use service role key
CREATE POLICY IF NOT EXISTS "Service role can update subscriptions"
  ON public.user
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================
-- Helper Function: Check Premium Access
-- ============================================
-- Function to check if user has active premium access
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user
    WHERE id = user_id
    AND (
      "subscriptionStatus" = 'premium'
      OR (
        "subscriptionStatus" = 'canceled'
        AND "subscriptionEndsAt" > NOW()
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.has_premium_access IS 'Check if user has active premium access (including canceled subscriptions in grace period)';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.has_premium_access TO authenticated;
