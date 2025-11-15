# Change: Add Polar Payments Integration

## Why
The application needs a payment system to monetize the SaaS product. Polar provides a modern payment solution with Better Auth integration, enabling seamless checkout flows, subscription management, and webhook handling for the existing "Free" and "Premium" product tiers.

## What Changes
- Add Polar SDK and Better Auth Polar plugin integration to the authentication system
- Configure Polar checkout plugin with product mappings for Free and Premium tiers
- Implement webhook handlers for payment events (checkout, subscription, order events)
- Create checkout UI components and success/confirmation pages
- Add environment variables for Polar access token, webhook secret, and success URL
- Integrate Polar customer portal for subscription management
- Add database migrations for Polar customer associations (if needed by Better Auth plugin)
- Create pricing page or upgrade flow in the dashboard
- Configure sandbox environment for testing before production deployment

## Impact
- **Affected specs**: New capability `payments` (no existing payment system)
- **Affected code**:
  - `/lib/auth.ts` - Add Polar plugin to Better Auth configuration
  - `/lib/auth-client.ts` - Add Polar client plugin
  - `/app/api/polar/webhooks/route.ts` - New webhook endpoint
  - `/app/checkout/[slug]/page.tsx` or similar - New checkout pages
  - `/app/success/page.tsx` - New success page after checkout
  - `/components/pricing/*` - New pricing/upgrade components
  - `/.env.example` - Add Polar environment variables
  - `/supabase/migrations/*` - Potential migration for Polar customer data
  - `/package.json` - Already has `@polar-sh/better-auth` and `@polar-sh/sdk`
- **External dependencies**: Polar.sh account with sandbox access token and webhook secret
- **Breaking changes**: None (new feature)
