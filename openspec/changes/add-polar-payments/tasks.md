# Implementation Tasks

## 1. Environment Configuration
- [ ] 1.1 Add Polar environment variables to `.env.example`
  - `POLAR_ACCESS_TOKEN` (sandbox token)
  - `POLAR_WEBHOOK_SECRET`
  - `POLAR_SUCCESS_URL`
  - `POLAR_PRODUCT_ID_FREE` (32cf4ffe-5b33-4ffa-b9f8-40adfdfc4b6d or actual Free product ID)
  - `POLAR_PRODUCT_ID_PREMIUM` (actual Premium product ID)
- [ ] 1.2 Document Polar setup instructions in README or setup guide

## 2. Better Auth Integration
- [ ] 2.1 Install/verify Polar packages are available (`@polar-sh/better-auth`, `@polar-sh/sdk`)
- [ ] 2.2 Create Polar SDK client instance in `/lib/polar.ts`
- [ ] 2.3 Update `/lib/auth.ts` to add Polar plugin with checkout, portal, usage, and webhooks sub-plugins
- [ ] 2.4 Configure checkout plugin with Free and Premium product mappings
- [ ] 2.5 Set `createCustomerOnSignUp: true` to auto-create Polar customers
- [ ] 2.6 Update `/lib/auth-client.ts` to add `polarClient()` plugin

## 3. Database Schema (Use Supabase MCP)
- [ ] 3.1 Check if Better Auth Polar plugin requires additional database tables/columns
- [ ] 3.2 Use Supabase MCP to create migration for Polar customer associations
  - Use `mcp4_apply_migration` to create migration with subscription fields
  - Migration should add: `polarCustomerId`, `subscriptionStatus`, `subscriptionEndsAt` to user table
  - Reference: `openspec/changes/add-polar-payments/migration-example.sql`
- [ ] 3.3 Use `mcp4_execute_sql` to verify migration was applied correctly
- [ ] 3.4 Use `mcp4_list_tables` to confirm user table has new columns

## 4. Webhook Handler (Use Supabase MCP for DB updates)
- [ ] 4.1 Create `/app/api/polar/webhooks/route.ts` with POST handler
- [ ] 4.2 Implement webhook signature verification using `POLAR_WEBHOOK_SECRET`
- [ ] 4.3 Add handlers for key events (use `mcp4_execute_sql` for subscription updates):
  - `onCheckoutCreated` - Log checkout creation
  - `onCheckoutUpdated` - Handle checkout status changes
  - `onOrderPaid` - Update user subscription status via Supabase MCP
  - `onSubscriptionActive` - Grant premium access (UPDATE user SET subscriptionStatus='premium')
  - `onSubscriptionCanceled` - Mark canceled (UPDATE with subscriptionEndsAt)
  - `onSubscriptionRevoked` - Revoke access (UPDATE subscriptionStatus='free')
  - `onCustomerStateChanged` - Sync customer data
- [ ] 4.4 Add error handling and logging for webhook events
- [ ] 4.5 Use `mcp4_get_logs` to debug webhook processing if issues occur
- [ ] 4.6 Configure webhook endpoint in Polar dashboard: `https://yourdomain.com/api/polar/webhooks`

## 5. Checkout Flow
- [ ] 5.1 Create pricing page component at `/app/pricing/page.tsx` or `/components/pricing/PricingCards.tsx`
- [ ] 5.2 Display Free and Premium tiers with features and pricing
- [ ] 5.3 Add "Upgrade" or "Subscribe" buttons that call `authClient.checkout()`
- [ ] 5.4 Implement checkout initiation with product slug or ID
- [ ] 5.5 Create success page at `/app/success/page.tsx` to handle `?checkout_id={CHECKOUT_ID}` redirect
- [ ] 5.6 Display confirmation message and next steps on success page

## 6. Customer Portal
- [ ] 6.1 Add "Manage Subscription" link in user profile or dashboard
- [ ] 6.2 Implement portal access using `authClient.portal()` or similar method
- [ ] 6.3 Allow users to view subscriptions, orders, and benefits

## 7. User Interface Updates
- [ ] 7.1 Add subscription status indicator in dashboard/profile
- [ ] 7.2 Show current plan (Free/Premium) in UI
- [ ] 7.3 Add upgrade prompts for free users
- [ ] 7.4 Implement feature gating based on subscription tier
- [ ] 7.5 Add loading states for checkout and portal actions

## 8. Testing & Validation
- [ ] 8.1 Test checkout flow in Polar sandbox environment
- [ ] 8.2 Verify webhook events are received and processed correctly
- [ ] 8.3 Test customer creation on signup
- [ ] 8.4 Test subscription activation and cancellation flows
- [ ] 8.5 Verify customer portal access and functionality
- [ ] 8.6 Test error scenarios (failed payments, webhook failures)
- [ ] 8.7 Validate environment variable configuration

## 9. Documentation
- [ ] 9.1 Document Polar setup process for new developers
- [ ] 9.2 Add instructions for obtaining Polar access token and webhook secret
- [ ] 9.3 Document webhook event handling logic
- [ ] 9.4 Add troubleshooting guide for common Polar integration issues
- [ ] 9.5 Update deployment guide with Polar production configuration steps

## 10. Production Preparation
- [ ] 10.1 Switch from sandbox to production Polar environment
- [ ] 10.2 Update access token to production token
- [ ] 10.3 Configure production webhook endpoint
- [ ] 10.4 Verify product IDs match production Polar products
- [ ] 10.5 Test end-to-end flow in staging environment before production deploy
