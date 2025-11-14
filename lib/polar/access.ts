'use server';

import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { checkUserAccess, getUserSubscriptions, getUserOrders } from './helpers';

/**
 * Check if the current user has access to a specific product
 * Use this in your app to gate features
 */
export async function hasProductAccess(productId: string): Promise<boolean> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return false;
    }

    return await checkUserAccess(userId, productId);
  } catch (error) {
    console.error('Error checking product access:', error);
    return false;
  }
}

/**
 * Get all active subscriptions for the current user
 */
export async function getCurrentUserSubscriptions() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, data: [], error: 'Not authenticated' };
    }

    return await getUserSubscriptions(userId);
  } catch (error) {
    console.error('Error getting user subscriptions:', error);
    return { success: false, data: [], error: 'Failed to fetch subscriptions' };
  }
}

/**
 * Get all orders for the current user
 */
export async function getCurrentUserOrders() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, data: [], error: 'Not authenticated' };
    }

    return await getUserOrders(userId);
  } catch (error) {
    console.error('Error getting user orders:', error);
    return { success: false, data: [], error: 'Failed to fetch orders' };
  }
}

/**
 * Check if user has any active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return false;
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('clerk_id', userId)
      .in('status', ['active', 'trialing'])
      .limit(1);

    if (error) {
      console.error('Error checking active subscription:', error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  } catch (error) {
    console.error('Error checking active subscription:', error);
    return false;
  }
}

/**
 * Get user's access details for all products
 */
export async function getUserAccessList() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, data: [], error: 'Not authenticated' };
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('user_access')
      .select('*')
      .eq('clerk_id', userId)
      .eq('has_access', true);

    if (error) {
      console.error('Error getting user access list:', error);
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error getting user access list:', error);
    return { success: false, data: [], error: 'Failed to fetch access list' };
  }
}
