'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileSync, getUserProfile } from '@/lib/sync/profile-sync';
import { useSupabaseClient } from '@/lib/db/supabase';
import { Loader2, Save, User } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function ProfileManager() {
  const { user, isLoaded } = useUser();
  const { syncProfile, updateProfileAndSync, isLoading: isSyncing } = useProfileSync(user);
  const supabase = useSupabaseClient();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });

  // Load existing profile on component mount
  useEffect(() => {
    if (isLoaded && user) {
      loadProfile();
    }
  }, [isLoaded, user]);

  const loadProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load profile
      const existingProfile = await getUserProfile(supabase, user.id);
      
      if (existingProfile) {
        setProfile(existingProfile);
        setFormData({
          first_name: existingProfile.first_name || '',
          last_name: existingProfile.last_name || '',
        });
      } else {
        // If no profile exists, sync from Clerk
        await handleSyncFromClerk();
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFromClerk = async () => {
    if (!user) return;

    // Sync with Clerk data but preserve any unsaved form changes
    const result = await syncProfile({
      first_name: user.firstName ?? undefined,
      last_name: user.lastName ?? undefined,
      avatar_url: user.imageUrl ?? undefined,
    });
    
    if (result.success && result.profile) {
      setProfile(result.profile);
      // Update form with the synced data
      setFormData({
        first_name: result.profile.first_name || user.firstName || '',
        last_name: result.profile.last_name || user.lastName || '',
      });
      
      toast.success('Profile synced from Clerk');
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: { target: { value: string } }) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to update your profile');
      return;
    }

    // Validate that we have a complete user object
    if (!user.id || !user.primaryEmailAddress?.emailAddress) {
      toast.error('User session not fully loaded. Please wait a moment and try again.');
      return;
    }

    setIsSaving(true);

    try {
      // Update profile in Clerk first, then sync to Supabase
      const updateResult = await updateProfileAndSync(formData);
      
      if (updateResult.success) {
        // Reload the profile to get the latest data
        await loadProfile();
      } else {
        // If the error suggests a token/session issue, suggest refreshing
        if (updateResult.error?.includes('sign in again') || updateResult.error?.includes('cache')) {
          toast.error(updateResult.error + ' Please try refreshing the page.');
        }
      }
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Manager</CardTitle>
          <CardDescription>Loading your profile...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Manager</CardTitle>
          <CardDescription>Please sign in to manage your profile.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Manager
        </CardTitle>
        <CardDescription>
          Manage your profile information that's synchronized between Clerk and Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
            <AvatarFallback>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{user.fullName || 'Anonymous User'}</h3>
            <p className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
            <p className="text-xs text-muted-foreground">Clerk ID: {user.id}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={handleInputChange('first_name')}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={handleInputChange('last_name')}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          

          {/* Sync Status */}
          {profile && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Sync Status</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Profile ID: {profile.id}</p>
                <p>Last updated: {new Date(profile.updated_at).toLocaleString()}</p>
                <p>Created: {new Date(profile.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isSyncing}
            className="flex-1"
          >
            {(isSaving || isSyncing) ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating Profile...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Profile
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleSyncFromClerk}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Sync from Clerk'
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Update Profile:</strong> Updates your profile in Clerk first, then syncs to Supabase</li>
            <li>Your profile changes will be reflected in both systems automatically</li>
            <li>Use "Sync from Clerk" to refresh your profile with the latest data from Clerk</li>
            <li>Your avatar and email are managed through Clerk settings</li>
            <li>Clerk is the single source of truth for your profile data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
