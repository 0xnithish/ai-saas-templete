# Design: Polar Payments Integration

## Context
The application currently has Better Auth for authentication with email/password and session management. We need to add payment processing capabilities to monetize the SaaS product. Polar provides a modern payment platform with native Better Auth integration, supporting both one-time purchases and subscriptions.

**Constraints:**
- Must integrate seamlessly with existing Better Auth setup
- Need to support both Free and Premium tiers
- Must handle webhook events reliably for subscription state changes
- Should work in sandbox environment first, then production
- Existing packages already include `@polar-sh/better-auth` and `@polar-sh/sdk`

**Stakeholders:**
- End users (need seamless checkout experience)
- Developers (need maintainable webhook handlers)
- Business (need reliable payment processing and subscription management)

## Goals / Non-Goals

**Goals:**
- Integrate Polar checkout with Better Auth for authenticated checkout flows
- Automatically create Polar customers when users sign up
- Handle subscription lifecycle events via webhooks (active, canceled, revoked)
- Provide customer portal for subscription management
- Support both Free and Premium product tiers
- Enable feature gating based on subscription status

**Non-Goals:**
- Custom payment UI (use Polar's hosted checkout)
- Usage-based billing implementation (can be added later with usage plugin)
- Multiple subscription tiers beyond Free/Premium
- Custom billing cycles or complex pricing models
- Organization-level subscriptions (individual users only for now)

## Decisions

### 1. Better Auth Polar Plugin Architecture
**Decision:** Use the `@polar-sh/better-auth` plugin with all four sub-plugins (checkout, portal, usage, webhooks) configured in `/lib/auth.ts`.

**Why:**
- Native integration with Better Auth reduces custom code
- Automatic customer creation on signup
- Built-in webhook signature verification
- Type-safe client methods for checkout and portal

**Alternatives considered:**
- Direct Polar SDK integration without Better Auth plugin → More boilerplate, no automatic customer sync
- Custom checkout implementation → Unnecessary complexity, Polar's hosted checkout is production-ready

### 2. Product Configuration Strategy
**Decision:** Store product IDs in environment variables and map them to slugs in the checkout plugin configuration.

**Why:**
- Product IDs differ between sandbox and production
- Slugs provide developer-friendly references (e.g., `/checkout/premium`)
- Easy to update without code changes

**Configuration:**
```typescript
checkout({
  products: [
    { productId: process.env.POLAR_PRODUCT_ID_FREE!, slug: "free" },
    { productId: process.env.POLAR_PRODUCT_ID_PREMIUM!, slug: "premium" }
  ],
  successUrl: process.env.POLAR_SUCCESS_URL || "/success?checkout_id={CHECKOUT_ID}",
  authenticatedUsersOnly: true
})
```

### 3. Webhook Event Handling
**Decision:** Implement granular webhook handlers for key subscription events in `/app/api/polar/webhooks/route.ts`.

**Key events to handle:**
- `onCheckoutUpdated` - Track checkout status changes
- `onOrderPaid` - Log successful payments
- `onSubscriptionActive` - Grant premium access (update user record or session)
- `onSubscriptionCanceled` - Mark for end-of-period access revocation
- `onSubscriptionRevoked` - Immediately revoke premium access
- `onCustomerStateChanged` - Sync customer data changes

**Why:**
- Granular handlers are easier to test and maintain than a catch-all
- Type-safe payload handling per event type
- Clear separation of concerns for different business logic

**Alternatives considered:**
- Single `onPayload` catch-all → Harder to maintain, less type safety
- No webhook handling → Can't sync subscription state, unreliable access control

### 4. Database Schema for Subscription State
**Decision:** Check if Better Auth Polar plugin auto-creates necessary tables. If not, create a migration for storing Polar customer IDs and subscription status.

**Likely schema addition:**
```sql
-- May be auto-created by Better Auth plugin
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "polar_customer_id" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "subscription_status" TEXT; -- 'free', 'premium', 'canceled'
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "subscription_ends_at" TIMESTAMPTZ;
```

**Why:**
- Need to query subscription status for feature gating
- Must persist Polar customer ID for portal access
- Track subscription end date for canceled subscriptions

### 5. Checkout Flow UX
**Decision:** Create a pricing page with upgrade buttons that trigger `authClient.checkout()` to redirect to Polar's hosted checkout.

**Flow:**
1. User clicks "Upgrade to Premium" on pricing page
2. Client calls `authClient.checkout({ slug: "premium" })`
3. User redirects to Polar hosted checkout (email pre-filled, authenticated)
4. After payment, redirects to `/success?checkout_id={CHECKOUT_ID}`
5. Webhook processes `onSubscriptionActive` event
6. User sees confirmation and can access premium features

**Why:**
- Polar's hosted checkout is PCI-compliant and battle-tested
- No need to handle payment forms, card validation, or security
- Authenticated checkout pre-fills user email and links to account

### 6. Environment Strategy
**Decision:** Use Polar sandbox environment for development/testing, production environment for live deployment.

**Configuration:**
```typescript
const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
});
```

**Why:**
- Sandbox allows testing without real payments
- Separate access tokens prevent accidental production charges during development
- Products and customers are isolated between environments

## Risks / Trade-offs

### Risk: Webhook Delivery Failures
**Mitigation:**
- Implement idempotent webhook handlers (check if event already processed)
- Add logging for all webhook events
- Use Polar dashboard to retry failed webhooks
- Consider adding a reconciliation job to sync state periodically

### Risk: Subscription State Drift
**Mitigation:**
- Use `onCustomerStateChanged` as catch-all for state sync
- Implement customer portal so users can self-serve subscription changes
- Add admin dashboard to manually sync subscription state if needed

### Risk: Product ID Mismatch Between Environments
**Mitigation:**
- Document product ID setup clearly in README
- Use environment variables for all product IDs
- Add validation check on startup to ensure product IDs are configured

### Trade-off: Hosted Checkout vs Custom UI
**Decision:** Use hosted checkout
**Trade-off:** Less control over checkout UI, but significantly less code and security responsibility

### Trade-off: Automatic Customer Creation
**Decision:** Enable `createCustomerOnSignUp: true`
**Trade-off:** Creates Polar customers even for users who never pay, but simplifies checkout flow and ensures customer exists when needed

## Migration Plan

### Phase 1: Development Setup (Sandbox)
1. Obtain Polar sandbox access token and webhook secret
2. Create Free and Premium products in Polar sandbox dashboard
3. Configure environment variables
4. Implement Better Auth integration
5. Create webhook endpoint
6. Test checkout flow end-to-end in sandbox

### Phase 2: UI Implementation
1. Create pricing page with Free/Premium tiers
2. Add upgrade buttons in dashboard for free users
3. Implement success page
4. Add subscription status indicators in UI
5. Implement feature gating based on subscription tier

### Phase 3: Production Deployment
1. Create products in Polar production environment
2. Obtain production access token and webhook secret
3. Update environment variables for production
4. Configure production webhook endpoint in Polar dashboard
5. Test checkout flow in staging environment
6. Deploy to production
7. Monitor webhook events and subscription state

### Rollback Plan
- If webhooks fail: Temporarily disable new subscriptions, manually sync state from Polar dashboard
- If checkout breaks: Revert Better Auth plugin changes, fall back to manual Polar SDK integration
- Database rollback: Migration includes down script to remove Polar-related columns

## Supabase MCP Integration

### When to Use Supabase MCP Tools

**Decision:** Leverage Supabase MCP server tools for database operations during implementation and debugging.

**Key MCP Tools for This Integration:**

1. **`mcp4_apply_migration`** - Create and apply database migrations
   - Use for: Adding Polar subscription fields to user table
   - Benefit: Automated migration creation with proper naming and tracking

2. **`mcp4_execute_sql`** - Execute SQL queries directly
   - Use for: Webhook handlers updating subscription status
   - Use for: Verifying migration results
   - Example: `UPDATE public.user SET "subscriptionStatus" = 'premium' WHERE id = $1`

3. **`mcp4_list_tables`** - List database tables and schema
   - Use for: Verifying migration applied correctly
   - Use for: Confirming new columns exist

4. **`mcp4_get_logs`** - Retrieve Supabase logs
   - Use for: Debugging webhook processing issues
   - Use for: Monitoring subscription update queries

5. **`mcp4_search_docs`** - Search Supabase documentation
   - Use for: Looking up RLS policy syntax
   - Use for: Finding best practices for subscription data storage

**Why Use MCP:**
- Faster development with AI-assisted database operations
- Consistent migration format matching existing schema
- Built-in logging and debugging capabilities
- Reduces context switching between tools

**Example Workflow:**
```
1. Use mcp4_apply_migration to create subscription fields migration
2. Use mcp4_list_tables to verify columns added
3. Implement webhook handlers with mcp4_execute_sql for updates
4. Use mcp4_get_logs to debug any webhook failures
5. Use mcp4_search_docs if RLS policies need adjustment
```

## Open Questions

1. **Q:** Should we store full subscription details (plan, price, renewal date) in our database or query Polar API on demand?
   **A:** Store minimal state (status, end date) in database for fast queries. Use Polar API for detailed subscription info in customer portal.

2. **Q:** How should we handle users who cancel but still have access until end of billing period?
   **A:** Store `subscription_ends_at` timestamp, check against current time for access control. Webhook `onSubscriptionRevoked` handles immediate revocation.

3. **Q:** Should Free tier users have a Polar customer record?
   **A:** Yes, with `createCustomerOnSignUp: true`. Simplifies upgrade flow and allows tracking of free users in Polar.

4. **Q:** What happens if a user signs up, gets a Polar customer ID, then deletes their account?
   **A:** Implement `onCustomerDeleted` webhook handler to clean up local records. Consider adding customer deletion to account deletion flow.

5. **Q:** Should we implement the usage plugin for future usage-based billing?
   **A:** Not in initial implementation. Add later if needed for metered features (API calls, storage, etc.).
