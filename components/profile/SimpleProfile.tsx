'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit2, Mail, Calendar, X, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { UserProfile } from '@clerk/nextjs';
import { useProfileSync } from '@/lib/sync/profile-sync';
import { toast } from 'sonner';

// Define User type for better type safety
interface ClerkUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  imageUrl?: string;
  primaryEmailAddress?: {
    emailAddress: string;
  } | null;
  createdAt?: Date | null;
}

export function SimpleProfile() {
  const { user, isLoaded } = useUser();
  const { syncProfile, isLoading } = useProfileSync(user);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const hasProfileChangedRef = useRef(false);
  const previousUserDataRef = useRef<ClerkUser | null>(null);

  // Monitor for user data changes
  useEffect(() => {
    if (user && previousUserDataRef.current) {
      const prevUser = previousUserDataRef.current;
      
      // Check if relevant profile fields have changed
      if (
        prevUser.firstName !== user.firstName ||
        prevUser.lastName !== user.lastName ||
        prevUser.imageUrl !== user.imageUrl ||
        prevUser.primaryEmailAddress?.emailAddress !== user.primaryEmailAddress?.emailAddress
      ) {
        hasProfileChangedRef.current = true;
      }
    }
    
    if (user) {
      previousUserDataRef.current = { ...user };
    }
  }, [user]);

  // Sync function
  const handleSyncProfile = async () => {
    if (!user || isLoading) return;
    
    setSyncStatus('syncing');
    
    try {
      const result = await syncProfile();
      
      if (result.success) {
        setSyncStatus('success');
        setLastSyncTime(new Date());
        hasProfileChangedRef.current = false;
        // Don't show toast here - syncProfile already shows it
      } else {
        setSyncStatus('error');
        // Don't show toast here - syncProfile already shows it
      }
    } catch {
      setSyncStatus('error');
      toast.error('Failed to sync profile');
    } finally {
      // Reset status after 3 seconds
      window.setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // Handle UserProfile modal close
  const handleProfileClose = () => {
    setIsProfileOpen(false);
    
    // If profile was changed, trigger sync
    if (hasProfileChangedRef.current) {
      handleSyncProfile();
    }
  };

  // Check for profile differences on mount
  useEffect(() => {
    if (user) {
      // Auto-sync on page load if needed
      const checkAndSync = async () => {
        try {
          // This is a simplified check - in a real implementation,
          // you might want to compare with Supabase data
          const shouldSync = hasProfileChangedRef.current || !lastSyncTime;
          
          if (shouldSync) {
            await handleSyncProfile();
          }
        } catch {
          // Error silently handled
        }
      };
      
      // Delay to ensure all data is loaded
      const timer = window.setTimeout(checkAndSync, 1000);
      return () => window.clearTimeout(timer);
    }
  }, [user]); // Only run when user data changes

  if (!isLoaded) {
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
    <>
      <Card className="w-full max-w-2xl mx-auto">
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
              <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
              <AvatarFallback className="text-lg">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {user.fullName || 'Anonymous User'}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid gap-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">First Name</span>
              <span className="font-medium">{user.firstName || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Name</span>
              <span className="font-medium">{user.lastName || 'Not set'}</span>
            </div>
            {user.createdAt && (
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
            <Button
              variant="default"
              className="w-full"
              onClick={() => setIsProfileOpen(true)}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* Sync Status Indicator (shown only when needed) */}
          {syncStatus !== 'idle' && (
            <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${
              syncStatus === 'syncing' ? 'bg-blue-50 text-blue-700' :
              syncStatus === 'success' ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
            }`}>
              {syncStatus === 'syncing' && <RefreshCw className="h-4 w-4 animate-spin" />}
              {syncStatus === 'success' && <CheckCircle className="h-4 w-4" />}
              {syncStatus === 'error' && <AlertCircle className="h-4 w-4" />}
              <span>
                {syncStatus === 'syncing' && 'Syncing profile...'}
                {syncStatus === 'success' && 'Profile synced successfully!'}
                {syncStatus === 'error' && 'Failed to sync profile'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clerk UserProfile Modal */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleProfileClose}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 z-50 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg border hover:bg-primary/90"
              onClick={handleProfileClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <UserProfile 
              routing="hash"
            />
          </div>
        </div>
      )}
    </>
  );
}
