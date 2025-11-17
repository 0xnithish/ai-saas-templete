'use client';

import { useState, useEffect } from 'react';
import { useSessionOptimized } from '@/components/auth/SessionProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateProfileAction, getProfileAction } from '@/lib/actions/profile-actions';
import { Loader2, Save, User } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function ProfileManager() {
  const { session, isLoading: sessionLoading } = useSessionOptimized();
  const user = session?.user;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
  });

  // Load existing profile on component mount
  useEffect(() => {
    if (!sessionLoading && user) {
      loadProfile();
    }
  }, [sessionLoading, user]);

  const loadProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await getProfileAction();
      
      if (result.success && result.profile) {
        setProfile(result.profile);
        setFormData({
          first_name: result.profile.first_name || '',
          last_name: result.profile.last_name || '',
          username: result.profile.username || '',
        });
      } else {
        toast.error(result.error || 'Failed to load profile');
      }
    } finally {
      setIsLoading(false);
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

    setIsSaving(true);

    try {
      const updateResult = await updateProfileAction(formData);
      
      if (updateResult.success) {
        toast.success('Profile updated successfully');
        await loadProfile();
      } else {
        toast.error(updateResult.error || 'Failed to update profile');
        if (updateResult.details) {
          console.error('Profile update error:', updateResult.details);
        }
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (sessionLoading || isLoading) {
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

  const getInitials = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name[0]}${formData.last_name[0]}`;
    }
    return user.name?.[0] || user.email[0];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Manager
        </CardTitle>
        <CardDescription>
          Manage your profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
            <AvatarFallback>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{user.name || 'Anonymous User'}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
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

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={handleInputChange('username')}
              placeholder="Enter your username"
            />
          </div>

          {/* Profile Status */}
          {profile && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Profile Status</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Profile ID: {profile.id}</p>
                <p>Last updated: {new Date(profile.updated_at).toLocaleString()}</p>
                <p>Created: {new Date(profile.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
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

        {/* Instructions */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Update your profile information and click "Update Profile" to save changes</li>
            <li>Your email is managed through your account settings</li>
            <li>Changes are saved to your profile database</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
