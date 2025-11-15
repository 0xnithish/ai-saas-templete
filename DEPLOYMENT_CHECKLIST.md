# 📋 Deployment Checklist: Better Auth + Polar

## Pre-Deployment

### 1. Environment Variables
- [ ] `POLAR_ACCESS_TOKEN` - From Polar dashboard
- [ ] `POLAR_WEBHOOK_SECRET` - From Polar webhook settings
- [ ] `POLAR_PRODUCT_ID_FREE` - Free tier product ID
- [ ] `POLAR_PRODUCT_ID_PREMIUM` - Premium tier product ID
- [ ] `BETTER_AUTH_SECRET` - Random secure string (min 32 chars)
- [ ] `BETTER_AUTH_URL` - Your production domain
- [ ] `DATABASE_URL` - Supabase connection string
- [ ] `RESEND_API_KEY` - For email verification (optional)

### 2. Database Migration
- [ ] Run Supabase migrations
- [ ] Verify `user` table has subscription fields:
  - `polarCustomerId`
  - `subscriptionStatus`
  - `subscriptionEndsAt`

### 3. Polar Configuration
- [ ] Switch from sandbox to production environment
- [ ] Update `POLAR_ACCESS_TOKEN` with production token
- [ ] Create production products (Free & Premium)
- [ ] Update product IDs in environment variables

### 4. Code Verification
- [ ] Webhook handlers defined inline in `lib/auth.ts`
- [ ] No separate webhook route file exists
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] All imports use correct paths

## Deployment Steps

### 1. Deploy Application
```bash
# Build and deploy your application
npm run build
# Deploy to your hosting platform (Vercel, Netlify, etc.)
```

### 2. Configure Polar Webhook
1. Go to [Polar Dashboard](https://polar.sh)
2. Navigate to Settings → Webhooks
3. Click "Add Webhook"
4. Enter webhook URL:
   ```
   https://yourdomain.com/api/auth/polar/webhooks
   ```
5. Select events to receive (or select all)
6. Copy the webhook secret
7. Add secret to your environment variables as `POLAR_WEBHOOK_SECRET`

### 3. Test Webhook Endpoint
```bash
# Test that the endpoint is accessible
curl https://yourdomain.com/api/auth/polar/webhooks

# Should return a response (not 404)
```

### 4. Verify Better Auth Routes
```bash
# Test Better Auth is working
curl https://yourdomain.com/api/auth/health

# Should return health status
```

## Post-Deployment Testing

### 1. Test User Registration
- [ ] Sign up with a new account
- [ ] Verify email verification works
- [ ] Check user created in Supabase
- [ ] Verify Polar customer created (check Polar dashboard)

### 2. Test Payment Flow
- [ ] Navigate to pricing page
- [ ] Click "Upgrade to Premium"
- [ ] Complete checkout in Polar
- [ ] Verify redirect to success page
- [ ] Check webhook received in Polar dashboard

### 3. Verify Database Update
```sql
-- Check user subscription status
SELECT 
  email, 
  "subscriptionStatus", 
  "polarCustomerId",
  "subscriptionEndsAt"
FROM public.user 
WHERE email = 'test@example.com';
```

Expected result:
- `subscriptionStatus` = 'premium'
- `polarCustomerId` = (Polar customer ID)
- `subscriptionEndsAt` = NULL

### 4. Check Server Logs
Look for these log messages:
```
[Polar Webhook] Subscription activated: { subscriptionId, customerId, productId }
[Polar Webhook] Granted premium access to user: <userId>
```

### 5. Test Subscription Cancellation
- [ ] Cancel subscription in Polar dashboard
- [ ] Verify webhook received
- [ ] Check `subscriptionStatus` = 'canceled'
- [ ] Verify `subscriptionEndsAt` is set

## Monitoring

### Key Metrics to Monitor
1. **Webhook Success Rate**
   - Monitor Polar dashboard for failed webhooks
   - Check server logs for webhook errors

2. **Payment Conversion**
   - Track users upgrading to premium
   - Monitor failed payments

3. **Database Consistency**
   - Verify subscription status matches Polar
   - Check for orphaned records

### Common Issues

#### Webhook Not Received
**Symptoms:** Payment completes but user status doesn't update

**Debug Steps:**
1. Check Polar dashboard → Webhooks → Recent Deliveries
2. Verify webhook URL is correct
3. Check webhook secret matches environment variable
4. Review server logs for errors

**Solution:**
- Ensure webhook URL: `https://yourdomain.com/api/auth/polar/webhooks`
- Verify `POLAR_WEBHOOK_SECRET` is correct
- Check firewall/security settings allow webhook requests

#### Signature Verification Failed
**Symptoms:** Webhook received but rejected

**Debug Steps:**
1. Check `POLAR_WEBHOOK_SECRET` in environment
2. Verify secret matches Polar dashboard
3. Check for extra whitespace in secret

**Solution:**
- Copy webhook secret exactly from Polar dashboard
- Redeploy with correct secret

#### User Status Not Updating
**Symptoms:** Webhook processed but database not updated

**Debug Steps:**
1. Check server logs for database errors
2. Verify `payload.data.customer.externalId` exists
3. Check database connection

**Solution:**
- Ensure `createCustomerOnSignUp: true` in `lib/auth.ts`
- Verify database permissions
- Check user ID matches `externalId`

## Rollback Plan

If issues occur after deployment:

1. **Revert Code**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Disable Webhook**
   - Go to Polar dashboard
   - Disable webhook temporarily
   - Fix issues
   - Re-enable webhook

3. **Manual Database Fix**
   ```sql
   -- Manually update user status if needed
   UPDATE public.user 
   SET "subscriptionStatus" = 'premium'
   WHERE email = 'affected-user@example.com';
   ```

## Success Criteria

✅ Deployment is successful when:
- [ ] Users can sign up and log in
- [ ] Email verification works
- [ ] Checkout flow completes successfully
- [ ] Webhooks are received and processed
- [ ] Database updates correctly
- [ ] No errors in server logs
- [ ] TypeScript compilation passes
- [ ] All tests pass

## Support Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Polar Documentation](https://docs.polar.sh)
- [Supabase Documentation](https://supabase.com/docs)
- Project files:
  - `IMPLEMENTATION_COMPLETE.md` - Implementation details
  - `QUICK_REFERENCE.md` - Quick reference guide
  - `PAYMENT_FIX_SUMMARY.md` - Fix documentation

---

**Last Updated:** November 15, 2025  
**Implementation:** Official Better Auth + Polar approach
