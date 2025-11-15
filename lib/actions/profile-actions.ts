'use server';

import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { headers } from 'next/headers';

interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface ProfileUpdateResult {
  success: boolean;
  profile?: any;
  error?: string;
  details?: string;
}

/**
 * Server Action to update a user's profile
 */
export async function updateProfileAction(profileData: UpdateProfileData): Promise<ProfileUpdateResult> {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return {
        success: false,
        error: 'User not authenticated',
        details: 'Please sign in to update your profile',
      };
    }

    const userId = session.user.id;

    // Update user in Better Auth user table if name changed
    if (profileData.first_name || profileData.last_name) {
      const name = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
      
      const supabase = getSupabaseAdmin();
      const { error: userError } = await supabase
        .from('user')
        .update({ name, updatedAt: new Date().toISOString() })
        .eq('id', userId);

      if (userError) {
        return {
          success: false,
          error: 'Failed to update user',
          details: userError.message,
        };
      }
    }

    // Update profile in Supabase
    const supabase = getSupabaseAdmin();
    
    const supabaseProfileData = {
      user_id: userId,
      email: session.user.email,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      username: profileData.username,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(supabaseProfileData, {
        onConflict: 'user_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: 'Failed to update profile',
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
 * Server Action to get a user's profile from the database
 */
export async function getProfileAction(): Promise<ProfileUpdateResult> {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return {
        success: false,
        error: 'User not authenticated',
        details: 'Please sign in to view your profile',
      };
    }

    const userId = session.user.id;

    // Get profile from Supabase
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        const newProfile = {
          user_id: userId,
          email: session.user.email,
          first_name: null,
          last_name: null,
          username: null,
          avatar_url: session.user.image || null,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          return {
            success: false,
            error: 'Failed to create profile',
            details: createError.message,
          };
        }

        // Fetch subscription data from user table
        const { data: userData } = await supabase
          .from('user')
          .select('subscriptionStatus, subscriptionEndsAt')
          .eq('id', userId)
          .single();

        return {
          success: true,
          profile: {
            ...createdProfile,
            subscriptionStatus: userData?.subscriptionStatus || 'free',
            subscriptionEndsAt: userData?.subscriptionEndsAt || null,
          },
        };
      }

      return {
        success: false,
        error: 'Failed to fetch profile',
        details: error.message,
      };
    }

    // Fetch subscription data from user table
    const { data: userData } = await supabase
      .from('user')
      .select('subscriptionStatus, subscriptionEndsAt')
      .eq('id', userId)
      .single();

    return {
      success: true,
      profile: {
        ...data,
        subscriptionStatus: userData?.subscriptionStatus || 'free',
        subscriptionEndsAt: userData?.subscriptionEndsAt || null,
      },
    };

  } catch (error) {
    return {
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
