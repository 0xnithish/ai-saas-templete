import { getSupabaseAdmin } from '@/lib/db/supabase';

/**
 * Get Clerk user ID from Polar customer email
 * This assumes the customer email matches the Clerk user's email
 */
export async function getClerkIdFromEmail(email: string): Promise<string | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('profiles')
      .select('clerk_id')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('Failed to find user by email:', email, error);
      return null;
    }

    return data.clerk_id;
  } catch (error) {
    console.error('Error getting clerk_id from email:', error);
    return null;
  }
}

/**
 * Create or update an order in Supabase
 */
export async function upsertOrder(orderData: {
  polar_order_id: string;
  clerk_id: string;
  polar_checkout_id?: string | null;
  status: string;
  amount: number;
  currency: string;
  product_id: string;
  product_name: string;
  customer_email: string;
  customer_name?: string | null;
  metadata?: Record<string, any> | null;
  completed_at?: string | null;
}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('orders')
      .upsert(
        {
          ...orderData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'polar_order_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Failed to upsert order:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error upserting order:', error);
    return { success: false, error };
  }
}

/**
 * Create or update a subscription in Supabase
 */
export async function upsertSubscription(subscriptionData: {
  polar_subscription_id: string;
  clerk_id: string;
  polar_product_id: string;
  polar_price_id: string;
  status: string;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
  customer_email: string;
  customer_name?: string | null;
  metadata?: Record<string, any> | null;
  canceled_at?: string | null;
}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          ...subscriptionData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'polar_subscription_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Failed to upsert subscription:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error upserting subscription:', error);
    return { success: false, error };
  }
}

/**
 * Grant or revoke user access to a product
 */
export async function updateUserAccess(accessData: {
  clerk_id: string;
  polar_customer_id: string;
  product_id: string;
  benefit_id?: string | null;
  has_access: boolean;
  polar_subscription_id?: string | null;
  polar_order_id?: string | null;
}) {
  try {
    const supabase = getSupabaseAdmin();
    
    // Check if access record exists
    const { data: existing } = await supabase
      .from('user_access')
      .select('id')
      .eq('clerk_id', accessData.clerk_id)
      .eq('product_id', accessData.product_id)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('user_access')
        .update({
          ...accessData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update user access:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('user_access')
        .insert({
          ...accessData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to insert user access:', error);
        return { success: false, error };
      }

      return { success: true, data };
    }
  } catch (error) {
    console.error('Error updating user access:', error);
    return { success: false, error };
  }
}

/**
 * Check if a user has access to a specific product
 */
export async function checkUserAccess(clerk_id: string, product_id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('user_access')
      .select('has_access')
      .eq('clerk_id', clerk_id)
      .eq('product_id', product_id)
      .eq('has_access', true)
      .maybeSingle();

    if (error) {
      console.error('Failed to check user access:', error);
      return false;
    }

    return data?.has_access ?? false;
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
}

/**
 * Get all active subscriptions for a user
 */
export async function getUserSubscriptions(clerk_id: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('clerk_id', clerk_id)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get user subscriptions:', error);
      return { success: false, error, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error getting user subscriptions:', error);
    return { success: false, error, data: [] };
  }
}

/**
 * Get all orders for a user
 */
export async function getUserOrders(clerk_id: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('clerk_id', clerk_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get user orders:', error);
      return { success: false, error, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error getting user orders:', error);
    return { success: false, error, data: [] };
  }
}
