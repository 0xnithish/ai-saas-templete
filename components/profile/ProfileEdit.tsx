'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { updateProfileAction } from '@/lib/actions/profile-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  username: string;
}

export function ProfileEdit() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;
  
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    username: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getInitials = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name[0]}${formData.last_name[0]}`;
    }
    return user?.name?.[0] || user?.email[0] || 'U';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateProfileAction(formData);
      
      if (result.success) {
        toast.success('Profile updated successfully');
        router.push('/profile');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Loading Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
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
          <CardDescription>Please sign in to edit your profile information.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Link>
            </Button>
          </div>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </CardTitle>
          <CardDescription>
            Update your personal information and account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.image || undefined} alt={getInitials()} />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold">
                  {formData.first_name && formData.last_name 
                    ? `${formData.first_name} ${formData.last_name}`
                    : user?.name || 'User'
                  }
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground">
                  This is how others will see you on the platform.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSaving} className="flex-1 sm:flex-none">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild className="flex-1 sm:flex-none">
                  <Link href="/profile">Cancel</Link>
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
