import { createClient } from '@supabase/supabase-js';
import { useAuth, useUser } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Standard client for operations without authentication
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authenticated client that uses Clerk session tokens
export function useSupabaseClient() {
  const { getToken } = useAuth();
  
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      // Session accessed from Clerk SDK
      accessToken: async () => {
        const token = await getToken({ template: 'supabase' });
        return token || null;
      },
    }
  );
}

// For server-side operations with elevated privileges
// Only available on the server side
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
  }
  return createClient(supabaseUrl, serviceRoleKey);
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          polar_order_id: string;
          clerk_id: string;
          polar_checkout_id: string | null;
          status: string;
          amount: number;
          currency: string;
          product_id: string;
          product_name: string;
          customer_email: string;
          customer_name: string | null;
          metadata: Record<string, any> | null;
          created_at: string | null;
          updated_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          polar_order_id: string;
          clerk_id: string;
          polar_checkout_id?: string | null;
          status?: string;
          amount: number;
          currency?: string;
          product_id: string;
          product_name: string;
          customer_email: string;
          customer_name?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string | null;
          updated_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          polar_order_id?: string;
          clerk_id?: string;
          polar_checkout_id?: string | null;
          status?: string;
          amount?: number;
          currency?: string;
          product_id?: string;
          product_name?: string;
          customer_email?: string;
          customer_name?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string | null;
          updated_at?: string | null;
          completed_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          polar_subscription_id: string;
          clerk_id: string;
          polar_product_id: string;
          polar_price_id: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean | null;
          customer_email: string;
          customer_name: string | null;
          metadata: Record<string, any> | null;
          created_at: string | null;
          updated_at: string | null;
          canceled_at: string | null;
        };
        Insert: {
          id?: string;
          polar_subscription_id: string;
          clerk_id: string;
          polar_product_id: string;
          polar_price_id: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean | null;
          customer_email: string;
          customer_name?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string | null;
          updated_at?: string | null;
          canceled_at?: string | null;
        };
        Update: {
          id?: string;
          polar_subscription_id?: string;
          clerk_id?: string;
          polar_product_id?: string;
          polar_price_id?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean | null;
          customer_email?: string;
          customer_name?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string | null;
          updated_at?: string | null;
          canceled_at?: string | null;
        };
      };
      user_access: {
        Row: {
          id: string;
          clerk_id: string;
          polar_customer_id: string;
          product_id: string;
          benefit_id: string | null;
          has_access: boolean | null;
          polar_subscription_id: string | null;
          polar_order_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          polar_customer_id: string;
          product_id: string;
          benefit_id?: string | null;
          has_access?: boolean | null;
          polar_subscription_id?: string | null;
          polar_order_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          polar_customer_id?: string;
          product_id?: string;
          benefit_id?: string | null;
          has_access?: boolean | null;
          polar_subscription_id?: string | null;
          polar_order_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [key in string]: never;
    };
    Functions: {
      [key in string]: never;
    };
    Enums: {
      [key in string]: never;
    };
    CompositeTypes: {
      [key in string]: never;
    };
  };
};
