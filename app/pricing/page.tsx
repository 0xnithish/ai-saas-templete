"use client";

import { authClient } from "@/lib/auth-client";
import { useSessionOptimized } from "@/components/auth/SessionProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const tiers = [
  {
    name: "Free",
    slug: "free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic dashboard access",
      "Up to 10 projects",
      "Community support",
      "Basic analytics",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    name: "Premium",
    slug: "premium",
    price: "$29",
    priceDetail: "/month",
    description: "For professionals and teams",
    features: [
      "Everything in Free",
      "Unlimited projects",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
      "API access",
      "Team collaboration",
    ],
    cta: "Upgrade to Premium",
    highlighted: true,
  },
];

export default function PricingPage() {
  const { session, isLoading } = useSessionOptimized();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (slug: string) => {
    if (!session) {
      toast.error("Please sign in to subscribe");
      router.push("/sign-in?redirect=/pricing");
      return;
    }

    if (slug === "free") {
      toast.info("You're already on the free plan");
      return;
    }

    try {
      setLoading(slug);

      // Initiate Dodo checkout via Better Auth Dodo client plugin
      // The client returns { data, error } instead of throwing on HTTP 4xx
      // @ts-ignore - dodopayments methods are added by the plugin
      const { data: checkout, error } = await authClient.dodopayments.checkout({
        slug,
        customer: {
          email: session.user.email,
          name: (session.user.name as string | undefined) ?? undefined,
        },
        billing: {
          city: "San Francisco",
          country: "US",
          state: "CA",
          street: "123 Market St",
          zipcode: "94103",
        },
      });

      if (error || !checkout) {
        console.error("Checkout error:", error);
        toast.error(error?.message || "Failed to start checkout. Please try again.");
        setLoading(null);
        return;
      }

      // Redirect user to Dodo checkout URL
      if (checkout.url) {
        window.location.href = checkout.url;
      } else {
        // Fallback in case URL is missing
        toast.error("Checkout URL not available. Please try again.");
        setLoading(null);
      }
    } catch (error) {
      console.error("Checkout unexpected error:", error);
      toast.error("Unexpected error starting checkout. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our core features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.slug}
              className={`relative ${
                tier.highlighted
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.priceDetail && (
                    <span className="text-muted-foreground ml-2">
                      {tier.priceDetail}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.highlighted ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleSubscribe(tier.slug)}
                  disabled={loading !== null || isLoading}
                >
                  {loading === tier.slug ? "Loading..." : tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>All plans include a 14-day money-back guarantee.</p>
          <p className="mt-2">
            Questions? Contact us at{" "}
            <a href="mailto:support@example.com" className="text-primary hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
