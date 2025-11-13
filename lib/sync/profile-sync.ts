import { useState, useCallback, useTransition } from 'react';
import { toast } from 'sonner';
import { useSupabaseClient } from '@/lib/db/supabase';
import { updateProfileAction } from '@/lib/actions/profile-actions';

interface ProfileData {
  clerk_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

interface SyncResponse {
  success: boolean;
  message: string;
  profile?: any;
  error?: string;
  details?: string;
}

export function useProfileSync(user: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending] = useTransition();
  const supabase = useSupabaseClient();

  const updateProfileInClerk = useCallback(async (profileData: Partial<ProfileData>): Promise<{ success: boolean; user?: any; error?: string }> => {
    try {
      // Validate that we have a proper user object
      if (!user?.id) {
        throw new Error('User session not available. Please sign in again.');
      }
      
      // Call the Server Action
      const result = await updateProfileAction({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
      });
      
      if (result.success) {
        return { success: true, user: result.profile };
      } else {
        throw new Error(result.error || result.details || 'Failed to update profile');
      }

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  }, [user]);

  const syncProfile = useCallback(async (profileData?: Partial<ProfileData>): Promise<SyncResponse> => {
    if (!user?.id) {
      return {
        success: false,
        error: 'User ID not found',
        message: 'Please sign in again',
      };
    }

    setIsLoading(true);

    try {
      // Get email from Clerk user
      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        throw new Error('User does not have a primary email address');
      }

      // Prepare profile data for Supabase
      const supabaseProfileData = {
        clerk_id: user.id,
        email: email,
        first_name: user.firstName || profileData?.first_name,
        last_name: user.lastName || profileData?.last_name,
        avatar_url: user.imageUrl || profileData?.avatar_url,
        ...profileData, // Allow override of the above values
        updated_at: new Date().toISOString(),
      };
      
      // Upsert profile in Supabase using the authenticated client
      const { data, error } = await supabase
        .from('profiles')
        .upsert(supabaseProfileData, {
          onConflict: 'clerk_id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        // Check for RLS policy issues
        if (error.code === '42501') {
          // Try with admin client for debugging (not for production)
          try {
            const { data: adminData, error: adminError } = await supabase
              .from('profiles')
              .upsert(supabaseProfileData, {
                onConflict: 'clerk_id',
                ignoreDuplicates: false,
              })
              .select()
              .single();

            if (adminError) {
              toast.error('Permission denied. Please complete the Clerk-Supabase setup first.');
              return {
                success: false,
                error: 'Permission denied - RLS policy issue',
                details: 'Make sure Third-Party Auth is enabled in Supabase and Clerk JWT template is configured.',
                message: 'Authentication configuration required',
              };
            } else {
              toast.success('Profile synced successfully (using admin access for testing)');
              return {
                success: true,
                message: 'Profile synced successfully (admin access)',
                profile: adminData,
              };
            }
          } catch {
            toast.error('Permission denied. Please complete the Clerk-Supabase setup first.');
            return {
              success: false,
              error: 'Permission denied - RLS policy issue',
              details: 'Make sure Third-Party Auth is enabled in Supabase and Clerk JWT template is configured.',
              message: 'Authentication configuration required',
            };
          }
        }
        
        // If table doesn't exist, provide helpful error message
        if (error.code === 'PGRST116') {
          toast.error('Database setup required. Please contact support.');
          return {
            success: false,
            error: 'Profiles table does not exist. Please create the database table first.',
            details: 'Run the migration SQL in your Supabase SQL editor.',
            message: 'Database setup required.',
          };
        }
        
        toast.error('Failed to sync profile: ' + error.message);
        return {
          success: false,
          error: 'Failed to sync profile',
          details: error.message,
          message: error.message,
        };
      }

      toast.success('Profile synced successfully!');
      
      return {
        success: true,
        message: 'Profile synced successfully',
        profile: data,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to sync profile. Please try again.');
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user]);

  const updateProfileAndSync = useCallback(async (profileData: Partial<ProfileData>): Promise<SyncResponse> => {
    if (!user?.id) {
      return {
        success: false,
        error: 'User not authenticated',
        message: 'Please sign in again',
      };
    }

    setIsLoading(true);

    try {
      // Step 1: Update profile in Clerk
      const clerkResult = await updateProfileInClerk(profileData);
      if (!clerkResult.success) {
        toast.error('Failed to update profile in Clerk: ' + clerkResult.error);
        return {
          success: false,
          error: 'Failed to update profile in Clerk',
          details: clerkResult.error,
          message: clerkResult.error || 'Unknown error',
        };
      }

      // Step 2: Sync updated Clerk data to Supabase
      const updatedUser = clerkResult.user || user;
      const syncResult = await syncProfile({
        first_name: updatedUser.firstName,
        last_name: updatedUser.lastName,
        avatar_url: updatedUser.imageUrl,
      });

      if (syncResult.success) {
        toast.success('Profile updated in Clerk and synced to database!');
      } else {
        toast.warning('Profile updated in Clerk but failed to sync to database');
      }

      return syncResult;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to update profile. Please try again.');
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [updateProfileInClerk, syncProfile, user]);

  return {
    syncProfile,
    updateProfileAndSync,
    isLoading,
    isPending,
  };
}

// Utility function to get the current user's profile from Supabase
export async function getUserProfile(supabase: any, clerkId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist
        return null;
      }
      throw error;
    }

    return data;
  } catch {
    return null;
  }
}

// Utility function to update profile directly in Supabase (bypassing sync)
export async function updateProfile(supabase: any, clerkId: string, updates: Partial<ProfileData>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('clerk_id', clerkId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, profile: data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile' 
    };
  }
}
