'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit3, Mail, Calendar, Shield, CheckCircle } from 'lucide-react';
import { getProfileAction } from '@/lib/actions/profile-actions';
import { toast } from 'sonner';
import Link from 'next/link';
import { SubscriptionCard } from './SubscriptionCard';

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

export function ProfileCard() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && user) {
      loadProfile();
    }
  }, [isPending, user]);

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

  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.name || 'User';
  };

  const getSubscriptionBadge = () => {
    const status = profile?.subscriptionStatus || 'free';
    const variants = {
      free: 'secondary',
      pro: 'default',
      enterprise: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isPending || isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Loading Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-muted rounded-full"></div>
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-64"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please sign in to view your profile information.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Your personal information and account settings
              </CardDescription>
            </div>
            {getSubscriptionBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header with Avatar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.image || undefined} alt={getFullName()} />
              <AvatarFallback className="text-xl font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{getFullName()}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              {profile?.username && (
                <span className="text-sm text-muted-foreground">@{profile.username}</span>
              )}
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">First Name</span>
                  <span className="font-medium">{profile?.first_name || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Name</span>
                  <span className="font-medium">{profile?.last_name || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-medium">{profile?.username || 'Not set'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email Verified</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subscription</span>
                  <span className="font-medium">{getSubscriptionBadge()}</span>
                </div>
                {profile?.subscriptionEndsAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Renews</span>
                    <span className="font-medium">
                      {new Date(profile.subscriptionEndsAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Button */}
          <div className="pt-4 flex justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/profile/edit">
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <SubscriptionCard 
        subscriptionStatus={profile?.subscriptionStatus}
        subscriptionEndsAt={profile?.subscriptionEndsAt}
      />
    </div>
  );
}
