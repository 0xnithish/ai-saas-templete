# 🚀 Quick Reference: Better Auth + Polar Integration

## Webhook Endpoint
```
https://yourdomain.com/api/auth/polar/webhooks
```
👉 Configure this in Polar Dashboard → Settings → Webhooks

## Webhook Handlers Location
```typescript
// lib/auth.ts
webhooks({
  secret: process.env.POLAR_WEBHOOK_SECRET!,
  onSubscriptionActive: async (payload) => { /* ... */ },
  onSubscriptionCanceled: async (payload) => { /* ... */ },
  onSubscriptionRevoked: async (payload) => { /* ... */ },
})
```

## How User Lookup Works
```typescript
// ✅ CORRECT (Official approach)
const userId = payload.data.customer?.externalId;

// ❌ WRONG (Don't do this)
const customer = await polarClient.customers.get({ id: customerId });
```

## Database Fields
```sql
-- User table subscription fields
"polarCustomerId" TEXT          -- Polar customer ID
"subscriptionStatus" TEXT       -- 'free' | 'premium' | 'canceled'
"subscriptionEndsAt" TIMESTAMPTZ -- Grace period end date
```

## Property Names (TypeScript)
```typescript
// ✅ Use camelCase (Polar SDK)
payload.data.customer.externalId
payload.data.customerId
payload.data.endsAt

// ❌ Not snake_case
payload.data.customer.external_id  // Wrong!
payload.data.customer_id           // Wrong!
```

## Testing Commands

### Check User Status
```sql
SELECT email, "subscriptionStatus", "polarCustomerId" 
FROM public.user 
WHERE email = 'your-email@example.com';
```

### Test Webhook Endpoint
```bash
curl https://yourdomain.com/api/auth/polar/webhooks
```

### Check Logs
```bash
# Look for these messages:
[Polar Webhook] Granted premium access to user: <userId>
[Polar Webhook] Subscription activated: { subscriptionId, customerId, productId }
```

## Common Issues & Solutions

### Issue: Webhook not firing
**Solution:** Verify webhook URL in Polar dashboard matches: `https://yourdomain.com/api/auth/polar/webhooks`

### Issue: User status not updating
**Solution:** Check that `payload.data.customer.externalId` exists and matches user ID

### Issue: TypeScript errors
**Solution:** Use camelCase properties (`externalId`, not `external_id`)

### Issue: Signature verification failed
**Solution:** Ensure `POLAR_WEBHOOK_SECRET` matches the secret in Polar dashboard

## Flow Diagram
```
User Signs Up
    ↓
Better Auth creates user (id: "abc123")
    ↓
Polar plugin creates customer (externalId: "abc123")
    ↓
User completes payment
    ↓
Polar sends webhook → /api/auth/polar/webhooks
    ↓
Better Auth verifies signature
    ↓
Calls onSubscriptionActive handler
    ↓
Handler extracts userId from payload.data.customer.externalId
    ↓
Updates database: subscriptionStatus = 'premium'
    ↓
User has premium access ✅
```

## Key Files
- `lib/auth.ts` - Webhook handlers (inline)
- `lib/polar.ts` - Polar SDK client
- `.env` - Environment variables
- No separate webhook route needed!

## Environment Variables
```bash
POLAR_ACCESS_TOKEN=polar_at_...
POLAR_WEBHOOK_SECRET=whsec_...
POLAR_PRODUCT_ID_FREE=prod_...
POLAR_PRODUCT_ID_PREMIUM=prod_...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://...
```

## Documentation Links
- [Better Auth Polar Plugin](https://www.better-auth.com/docs/plugins/polar)
- [Polar Webhooks](https://docs.polar.sh/webhooks)
- [Better Auth Options](https://www.better-auth.com/docs/options)
