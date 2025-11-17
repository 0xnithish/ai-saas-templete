"use client";

import { useState, useEffect } from "react";
import { useSessionOptimized } from "@/components/auth/SessionProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Link as LinkIcon, Unlink, Shield, CheckCircle } from "lucide-react";
import { signIn } from "@/lib/auth-client";

interface SocialAccount {
  provider: "google" | "github";
  providerId: string;
  accountId: string;
  linked: boolean;
}

interface SocialAccountsCardProps {
  className?: string;
}

export function SocialAccountsCard({ className }: SocialAccountsCardProps) {
  const { session } = useSessionOptimized();
  const user = session?.user;
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);

  // Mock social accounts data - in a real implementation, you'd fetch this from your database
  useEffect(() => {
    // This would be a server action to fetch linked social accounts
    const fetchSocialAccounts = async () => {
      setIsLoading(true);
      try {
        // For now, we'll simulate this data
        // In production, you'd query the account table for the current user's linked accounts
        const mockAccounts: SocialAccount[] = [
          // { provider: "google", providerId: "google", accountId: "123456789", linked: false },
          // { provider: "github", providerId: "github", accountId: "987654321", linked: false },
        ];

        setSocialAccounts(mockAccounts);
      } catch (error) {
        console.error("Failed to fetch social accounts:", error);
        toast.error("Failed to load social accounts");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSocialAccounts();
    }
  }, [user]);

  const handleLinkSocial = async (provider: "google" | "github") => {
    try {
      setLinkingProvider(provider);

      const result = await signIn.social({
        provider,
        callbackURL: "/profile?social_linked=true",
      });

      if (result.error) {
        toast.error(result.error.message || `Failed to link ${provider} account`);
        return;
      }

      toast.success(`Redirecting to ${provider}...`);
    } catch (error) {
      toast.error(`An unexpected error occurred with ${provider} linking`);
      console.error(`${provider} linking error:`, error);
    } finally {
      setLinkingProvider(null);
    }
  };

  const handleUnlinkSocial = async (provider: "google" | "github") => {
    try {
      // This would be a server action to unlink the social account
      // For now, we'll just show a success message
      toast.success(`${provider} account unlinked successfully`);

      // Update local state
      setSocialAccounts(prev =>
        prev.map(account =>
          account.provider === provider
            ? { ...account, linked: false, accountId: "" }
            : account
        )
      );
    } catch (error) {
      toast.error(`Failed to unlink ${provider} account`);
      console.error(`${provider} unlinking error:`, error);
    }
  };

  const getProviderInfo = (provider: "google" | "github") => {
    switch (provider) {
      case "google":
        return {
          name: "Google",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          ),
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "github":
        return {
          name: "GitHub",
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          ),
          color: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Social Accounts
          </CardTitle>
          <CardDescription>Manage your linked social accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["google", "github"].map((provider) => (
              <div key={provider} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="animate-pulse flex items-center gap-3">
                  <div className="h-4 w-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
                <div className="animate-pulse h-8 w-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Social Accounts
        </CardTitle>
        <CardDescription>
          Link your social accounts for easier sign-in and enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(["google", "github"] as const).map((provider) => {
            const account = socialAccounts.find(acc => acc.provider === provider);
            const isLinked = account?.linked || false;
            const providerInfo = getProviderInfo(provider);

            return (
              <div
                key={provider}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  isLinked ? "bg-muted/30" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {providerInfo.icon}
                  <div>
                    <div className="font-medium">{providerInfo.name}</div>
                    {isLinked ? (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Connected
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Not connected</div>
                    )}
                  </div>
                </div>

                {isLinked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnlinkSocial(provider)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Unlink className="h-3 w-3 mr-1" />
                    Unlink
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLinkSocial(provider)}
                    disabled={linkingProvider === provider}
                  >
                    {linkingProvider === provider ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <LinkIcon className="h-3 w-3 mr-1" />
                    )}
                    {linkingProvider === provider ? "Linking..." : "Link"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Security Benefits</p>
              <p className="text-xs">
                Linking social accounts adds an extra layer of security and makes it easier to recover your account if needed.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}