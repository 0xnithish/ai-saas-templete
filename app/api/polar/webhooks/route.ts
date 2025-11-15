import { Webhooks } from '@polar-sh/nextjs';
import { getSupabaseAdmin } from '@/lib/db/supabase';

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  
  onPayload: async (payload) => {
    console.log('✅ Received Polar webhook:', payload.type);
    console.log('📦 Payload data:', JSON.stringify(payload.data, null, 2));
    
    const supabase = getSupabaseAdmin();
    const data = payload.data as any;

    switch (payload.type) {
      case 'customer.created':
      case 'customer.updated': {
        // Use externalId (user ID) to match, not email
        const userId = data.external_id;
        const customerId = data.id;
        
        if (!userId) {
          console.warn('⚠️ No external_id in customer event, trying email fallback');
          // Fallback to email if no externalId
          const { error } = await supabase
            .from('user')
            .update({
              polarCustomerId: customerId,
              updatedAt: new Date().toISOString(),
            })
            .eq('email', data.email);

          if (error) {
            console.error('❌ Failed to update customer by email:', error);
          } else {
            console.log(`✅ Updated customer ${data.email} with Polar ID ${customerId}`);
          }
          break;
        }

        const { error } = await supabase
          .from('user')
          .update({
            polarCustomerId: customerId,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', userId);

        if (error) {
          console.error('❌ Failed to update customer:', error);
        } else {
          console.log(`✅ Updated user ${userId} with Polar customer ID ${customerId}`);
        }
        break;
      }

      case 'order.paid': {
        // Use externalId from customer object
        const userId = data.customer?.external_id;
        const customerId = data.customer?.id;
        
        if (!userId) {
          console.warn('⚠️ No external_id in order.paid, trying email fallback');
          const customerEmail = data.customer?.email;
          if (!customerEmail) {
            console.error('❌ No customer email in order.paid event');
            break;
          }

          const hasSubscription = data.subscription;
          const { error } = await supabase
            .from('user')
            .update({
              polarCustomerId: customerId,
              subscriptionStatus: hasSubscription ? 'premium' : 'free',
              subscriptionEndsAt: hasSubscription ? data.subscription?.current_period_end : null,
              updatedAt: new Date().toISOString(),
            })
            .eq('email', customerEmail);

          if (error) {
            console.error('❌ Failed to update user on order.paid:', error);
          } else {
            console.log(`✅ Order paid for ${customerEmail}, subscription: ${hasSubscription ? 'premium' : 'none'}`);
          }
          break;
        }

        // Use userId (externalId) for matching
        const hasSubscription = data.subscription;
        const { error } = await supabase
          .from('user')
          .update({
            polarCustomerId: customerId,
            subscriptionStatus: hasSubscription ? 'premium' : 'free',
            subscriptionEndsAt: hasSubscription ? data.subscription?.current_period_end : null,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', userId);

        if (error) {
          console.error('❌ Failed to update user on order.paid:', error);
        } else {
          console.log(`✅ Order paid for user ${userId}, subscription: ${hasSubscription ? 'premium' : 'none'}`);
        }
        break;
      }

      case 'subscription.created':
      case 'subscription.updated': {
        const customerEmail = data.customer?.email;
        if (!customerEmail) {
          console.error('No customer email in subscription event');
          break;
        }

        const { error } = await supabase
          .from('user')
          .update({
            polarCustomerId: data.customer.id,
            subscriptionStatus: data.status === 'active' ? 'premium' : 'free',
            subscriptionEndsAt: data.current_period_end,
            updatedAt: new Date().toISOString(),
          })
          .eq('email', customerEmail);

        if (error) {
          console.error('Failed to update user subscription:', error);
        } else {
          console.log(`Updated subscription for ${customerEmail}: ${data.status}`);
        }
        break;
      }

      case 'subscription.canceled': {
        const customerEmail = data.customer?.email;
        if (!customerEmail) {
          console.error('No customer email in cancellation event');
          break;
        }

        const { error } = await supabase
          .from('user')
          .update({
            subscriptionStatus: 'canceled',
            subscriptionEndsAt: data.current_period_end,
            updatedAt: new Date().toISOString(),
          })
          .eq('email', customerEmail);

        if (error) {
          console.error('Failed to update canceled subscription:', error);
        } else {
          console.log(`Canceled subscription for ${customerEmail}, access until ${data.current_period_end}`);
        }
        break;
      }

      case 'subscription.revoked': {
        const customerEmail = data.customer?.email;
        if (!customerEmail) {
          console.error('No customer email in revocation event');
          break;
        }

        const { error } = await supabase
          .from('user')
          .update({
            subscriptionStatus: 'free',
            subscriptionEndsAt: null,
            updatedAt: new Date().toISOString(),
          })
          .eq('email', customerEmail);

        if (error) {
          console.error('Failed to revoke subscription:', error);
        } else {
          console.log(`Revoked subscription for ${customerEmail}`);
        }
        break;
      }

      case 'customer.created':
      case 'customer.updated': {
        const { error } = await supabase
          .from('user')
          .update({
            polarCustomerId: data.id,
            updatedAt: new Date().toISOString(),
          })
          .eq('email', data.email);

        if (error) {
          console.error('Failed to update customer:', error);
        } else {
          console.log(`Updated customer ${data.email} with Polar ID ${data.id}`);
        }
        break;
      }
    }
  },
});
