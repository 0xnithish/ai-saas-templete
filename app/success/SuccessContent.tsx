"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking checkout status
    // In production, you might want to verify the checkout with Polar API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [checkoutId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">
                Processing your subscription...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for subscribing to Premium
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Your subscription has been activated successfully. You now have access to all premium features.
            </p>
            {checkoutId && (
              <p className="text-xs font-mono bg-muted p-2 rounded">
                Checkout ID: {checkoutId}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">What's next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Access all premium features in your dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Manage your subscription in your profile</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Get priority support from our team</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/profile">Manage Subscription</Link>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            A confirmation email has been sent to your inbox.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
