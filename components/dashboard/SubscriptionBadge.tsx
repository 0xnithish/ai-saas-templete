"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function SubscriptionBadge() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user subscription status
    // In a real implementation, this would come from the session or an API call
    const fetchSubscriptionStatus = async () => {
      try {
        // TODO: Implement actual subscription status fetch
        // For now, we'll use a placeholder
        setSubscriptionStatus("free");
      } catch (error) {
        console.error("Failed to fetch subscription status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  if (loading) {
    return null;
  }

  const isPremium = ["active", "trialing"].includes(subscriptionStatus);

  return (
    <Link href="/profile" className="inline-block">
      <Badge
        variant={isPremium ? "default" : "secondary"}
        className={
          isPremium
            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
            : "cursor-pointer hover:bg-secondary/80"
        }
      >
        {isPremium && <Sparkles className="mr-1 h-3 w-3" />}
        {isPremium ? "Premium" : "Free Plan"}
      </Badge>
    </Link>
  );
}
