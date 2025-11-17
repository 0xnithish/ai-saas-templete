'use client';

import { useState, useEffect } from 'react';
import { useSessionOptimized } from '@/components/auth/SessionProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit2, Mail, Calendar } from 'lucide-react';
import { getProfileAction } from '@/lib/actions/profile-actions';
import { toast } from 'sonner';
import Link from 'next/link';
import { SubscriptionCard } from './SubscriptionCard';
import { SocialAccountsCard } from './SocialAccountsCard';

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
  subscriptionStatus?: string;
  subscriptionEndsAt?: string | null;
}

export function SimpleProfile() {
  const { session, isLoading: sessionLoading } = useSessionOptimized();
  const user = session?.user;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    if (!sessionLoading && user) {
      loadProfile();
    }
  }, [sessionLoading, user]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const result = await getProfileAction();
      if (result.success && result.profile) {
        setProfile(result.profile);
      } else {
        toast.error(result.error || 'Failed to load profile');
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    return user?.name?.[0] || user?.email[0] || 'U';
  };

  if (sessionLoading || isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Loading Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-muted rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-48"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please sign in to view your profile information.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      {/* Subscription Card */}
      <SubscriptionCard 
        subscriptionStatus={profile?.subscriptionStatus}
        subscriptionEndsAt={profile?.subscriptionEndsAt}
      />

      {/* Social Accounts Card */}
      <SocialAccountsCard />

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Your personal information and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
            <AvatarFallback className="text-lg">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              {user?.name || 'Anonymous User'}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user?.email}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid gap-3 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">First Name</span>
            <span className="font-medium">{profile?.first_name || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Name</span>
            <span className="font-medium">{profile?.last_name || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Username</span>
            <span className="font-medium">{profile?.username || 'Not set'}</span>
          </div>
          {user?.createdAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Member Since</span>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Edit Profile Button */}
        <div className="pt-4">
          <Button asChild variant="default" className="w-full">
            <Link href="/profile/edit">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
