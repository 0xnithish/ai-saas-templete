'use server';

import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';

interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
}

interface ProfileUpdateResult {
  success: boolean;
  profile?: any;
  error?: string;
  details?: string;
}

/**
 * Server Action to update a user's profile in Clerk and sync to Supabase
 */
export async function updateProfileAction(profileData: UpdateProfileData): Promise<ProfileUpdateResult> {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated',
        details: 'Please sign in to update your profile',
      };
    }

    // Check if Clerk secret key is available
    if (!process.env.CLERK_SECRET_KEY) {
      return {
        success: false,
        error: 'Server configuration error',
        details: 'Clerk secret key not configured',
      };
    }

    // Update user profile in Clerk using the Admin API
    const clerkResponse = await global.fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
      }),
    });

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json().catch(() => ({}));

      // Provide specific error messages for common Clerk API errors
      let errorMessage = 'Failed to update profile in Clerk';
      let details = `${clerkResponse.status}: ${errorData.message || clerkResponse.statusText}`;

      if (clerkResponse.status === 400) {
        errorMessage = 'Invalid profile data';
        if (errorData.errors && Array.isArray(errorData.errors)) {
          details = errorData.errors.map((e: any) => `${e.long_message || e.message}`).join('; ');
        }
      } else if (clerkResponse.status === 401) {
        errorMessage = 'Clerk authentication failed';
        details = 'CLERK_SECRET_KEY may be invalid or expired';
      } else if (clerkResponse.status === 403) {
        errorMessage = 'Permission denied';
        details = 'Clerk secret key may not have sufficient permissions';
      } else if (clerkResponse.status === 404) {
        errorMessage = 'User not found';
        details = `User ${userId} does not exist in Clerk`;
      }

      return {
        success: false,
        error: errorMessage,
        details,
      };
    }

    const updatedUser = await clerkResponse.json();

    // Sync updated profile to Supabase
    const supabase = getSupabaseAdmin();
    
    const supabaseProfileData = {
      clerk_id: userId,
      email: updatedUser.email_addresses?.[0]?.email_address || '',
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      avatar_url: updatedUser.image_url,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(supabaseProfileData, {
        onConflict: 'clerk_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: 'Profile updated in Clerk but failed to sync to database',
        details: error.message,
      };
    }

    return {
      success: true,
      profile: data,
    };

  } catch (error) {
    return {
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Server Action to sync a user's profile from Clerk to Supabase
 */
export async function syncProfileToSupabase(): Promise<ProfileUpdateResult> {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated',
        details: 'Please sign in to sync your profile',
      };
    }

    // Get user data from Clerk
    if (!process.env.CLERK_SECRET_KEY) {
      return {
        success: false,
        error: 'Server configuration error',
        details: 'Clerk secret key not configured',
      };
    }

    const clerkResponse = await global.fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json().catch(() => ({}));
      return {
        success: false,
        error: 'Failed to fetch user from Clerk',
        details: `${clerkResponse.status}: ${errorData.message || clerkResponse.statusText}`,
      };
    }

    const clerkUser = await clerkResponse.json();

    // Sync to Supabase
    const supabase = getSupabaseAdmin();
    
    const supabaseProfileData = {
      clerk_id: userId,
      email: clerkUser.email_addresses?.[0]?.email_address || '',
      first_name: clerkUser.first_name,
      last_name: clerkUser.last_name,
      avatar_url: clerkUser.image_url,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(supabaseProfileData, {
        onConflict: 'clerk_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: 'Failed to sync profile to database',
        details: error.message,
      };
    }

    return {
      success: true,
      profile: data,
    };

  } catch (error) {
    return {
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
