"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

interface SubscriptionCardProps {
  subscriptionStatus?: string;
  subscriptionEndsAt?: string | null;
}

export function SubscriptionCard({ 
  subscriptionStatus = "free", 
  subscriptionEndsAt 
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const isPremium = ["active", "trialing"].includes(subscriptionStatus);
  const isCanceled = subscriptionStatus === "canceled";
  const hasGracePeriod = isCanceled && subscriptionEndsAt && new Date(subscriptionEndsAt) > new Date();

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      
      // Open Polar customer portal
      // @ts-ignore - portal method is added by the Polar plugin
      await authClient.portal();
      
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("Failed to open subscription portal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (isPremium) {
      return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Premium</Badge>;
    }
    if (hasGracePeriod) {
      return <Badge variant="outline" className="border-orange-500 text-orange-500">Canceled</Badge>;
    }
    return <Badge variant="secondary">Free</Badge>;
  };

  const getStatusDescription = () => {
    if (hasGracePeriod) {
      const endDate = new Date(subscriptionEndsAt!).toLocaleDateString();
      return `Your premium access will end on ${endDate}`;
    }
    if (isPremium) {
      return "You have access to all premium features";
    }
    return "Upgrade to unlock premium features";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Subscription</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          {getStatusDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan Info */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Plan</span>
            <span className="text-lg font-bold">
              {isPremium || hasGracePeriod ? "Premium" : "Free"}
            </span>
          </div>
          
          {isPremium && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Unlimited projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Advanced analytics</span>
              </div>
            </div>
          )}

          {hasGracePeriod && (
            <div className="text-sm text-orange-600 dark:text-orange-400">
              Your subscription has been canceled but you still have access until{" "}
              {new Date(subscriptionEndsAt!).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {isPremium || hasGracePeriod ? (
            <Button
              onClick={handleManageSubscription}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {loading ? "Loading..." : "Manage Subscription"}
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link href="/pricing">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Link>
            </Button>
          )}
        </div>

        {!isPremium && !hasGracePeriod && (
          <p className="text-xs text-center text-muted-foreground">
            Get access to all premium features for $29/month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
