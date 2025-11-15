# Polar Payments Integration Proposal

## Overview
This proposal adds Polar payment processing to the AI SaaS template, enabling monetization through Free and Premium subscription tiers.

## Quick Reference

### Product IDs (from your Polar account)
- **Free Product ID**: `32cf4ffe-5b33-4ffa-b9f8-40adfdfc4b6d` (or your actual Free product ID)
- **Premium Product ID**: [To be obtained from Polar dashboard]

### Environment Variables Needed
```bash
POLAR_ACCESS_TOKEN=your_sandbox_token_here
POLAR_WEBHOOK_SECRET=your_webhook_secret_here
POLAR_SUCCESS_URL=https://yourdomain.com/success?checkout_id={CHECKOUT_ID}
POLAR_PRODUCT_ID_FREE=32cf4ffe-5b33-4ffa-b9f8-40adfdfc4b6d
POLAR_PRODUCT_ID_PREMIUM=your_premium_product_id_here
```

### Key Integration Points

#### 1. Better Auth Configuration (`/lib/auth.ts`)
```typescript
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
});

// Add to betterAuth plugins array:
polar({
  client: polarClient,
  createCustomerOnSignUp: true,
  use: [
    checkout({
      products: [
        { productId: process.env.POLAR_PRODUCT_ID_FREE!, slug: "free" },
        { productId: process.env.POLAR_PRODUCT_ID_PREMIUM!, slug: "premium" }
      ],
      successUrl: process.env.POLAR_SUCCESS_URL || "/success?checkout_id={CHECKOUT_ID}",
      authenticatedUsersOnly: true
    }),
    portal(),
    usage(),
    webhooks({
      secret: process.env.POLAR_WEBHOOK_SECRET!,
      onSubscriptionActive: async (payload) => {
        // Grant premium access
      },
      onSubscriptionCanceled: async (payload) => {
        // Mark for end-of-period revocation
      },
      onSubscriptionRevoked: async (payload) => {
        // Immediately revoke premium access
      },
      onOrderPaid: async (payload) => {
        // Log successful payment
      }
    })
  ]
})
```

#### 2. Client Configuration (`/lib/auth-client.ts`)
```typescript
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [polarClient()]
});
```

#### 3. Webhook Endpoint (`/app/api/polar/webhooks/route.ts`)
Will be auto-handled by Better Auth Polar plugin at `/api/polar/webhooks`

#### 4. Checkout Initiation (in your UI components)
```typescript
import { authClient } from "@/lib/auth-client";

// Initiate checkout
await authClient.checkout({ slug: "premium" });
// or
await authClient.checkout({ products: ["product-id-here"] });
```

## Files to Create/Modify

### New Files
- `/lib/polar.ts` - Polar SDK client (optional, can be inline in auth.ts)
- `/app/api/polar/webhooks/route.ts` - Webhook handler (may be auto-created by plugin)
- `/app/success/page.tsx` - Checkout success page
- `/app/pricing/page.tsx` - Pricing page with Free/Premium tiers
- `/components/pricing/PricingCards.tsx` - Pricing display components
- `/supabase/migrations/[timestamp]_add_polar_fields.sql` - Database migration

### Modified Files
- `/lib/auth.ts` - Add Polar plugin
- `/lib/auth-client.ts` - Add polarClient plugin
- `/.env.example` - Add Polar environment variables
- `/README.md` or setup guide - Document Polar setup

## Implementation Phases

### Phase 1: Core Integration (Sandbox)
1. Configure environment variables
2. Add Polar plugin to Better Auth
3. Create database migration for subscription fields
4. Test customer creation on signup

### Phase 2: Checkout & Webhooks
1. Implement webhook handlers
2. Create pricing page
3. Add checkout buttons
4. Create success page
5. Test full checkout flow in sandbox

### Phase 3: UI & Feature Gating
1. Add subscription status indicators
2. Implement feature gating logic
3. Add customer portal access
4. Test subscription lifecycle (activate, cancel, revoke)

### Phase 4: Production Deployment
1. Obtain production credentials
2. Update environment variables
3. Configure production webhook endpoint in Polar dashboard
4. Test in staging
5. Deploy to production

## Testing Checklist

- [ ] User signup creates Polar customer
- [ ] Checkout flow redirects to Polar hosted checkout
- [ ] Successful payment redirects to success page
- [ ] Webhook events are received and processed
- [ ] Subscription activation grants premium access
- [ ] Subscription cancellation marks for end-of-period
- [ ] Subscription revocation immediately removes access
- [ ] Customer portal is accessible from dashboard
- [ ] Feature gating works correctly
- [ ] Environment switching (sandbox → production) works

## Documentation Links

- [Better Auth Polar Plugin Docs](https://www.better-auth.com/docs/plugins/polar)
- [Polar Better Auth Adapter Docs](https://polar.sh/docs/integrate/sdk/adapters/better-auth)
- [Polar SDK Documentation](https://github.com/polarsource/polar)

## Next Steps

1. **Review this proposal** - Ensure all requirements are clear
2. **Obtain Polar credentials** - Get sandbox access token and webhook secret
3. **Get approval** - Do not implement until proposal is approved
4. **Follow tasks.md** - Implement sequentially according to the task list
5. **Validate** - Test thoroughly in sandbox before production

## Supabase MCP Integration

During implementation, use Supabase MCP tools for efficient database operations:

- **`mcp4_apply_migration`** - Create the subscription fields migration
- **`mcp4_execute_sql`** - Update subscription status in webhook handlers
- **`mcp4_list_tables`** - Verify migration applied correctly
- **`mcp4_get_logs`** - Debug webhook processing issues
- **`mcp4_search_docs`** - Look up Supabase best practices

See `design.md` section "Supabase MCP Integration" for detailed usage examples.

## Notes

- The `@polar-sh/better-auth` and `@polar-sh/sdk` packages are already installed in package.json
- Polar sandbox environment expires on December 14, 2025 (per your notes)
- You have two products: "Free" and "Premium" already created in Polar
- Webhook endpoint will be at: `https://yourdomain.com/api/polar/webhooks`
- Use Supabase MCP tools during implementation for faster development
