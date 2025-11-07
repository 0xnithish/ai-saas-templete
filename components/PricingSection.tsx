"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      id: 1,
      name: "Starter",
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        "Up to 5 projects",
        "10GB storage",
        "Email support",
        "Basic analytics",
        "24/7 community access",
      ],
      popular: false,
    },
    {
      id: 2,
      name: "Pro",
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        "Unlimited projects",
        "100GB storage",
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
      ],
      popular: true,
    },
    {
      id: 3,
      name: "Advanced",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Dedicated support",
        "Custom integrations",
        "API access",
      ],
      popular: false,
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Pricing
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Choose the perfect plan for your needs
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary px-3 py-1 text-xs font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      {formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  {isYearly && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Save {formatPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)} per year
                    </p>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}