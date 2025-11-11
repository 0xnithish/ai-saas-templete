'use client';

import NumberFlow from '@number-flow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const plans = [
  {
    id: 'hobby',
    name: 'Starter',
    price: {
      monthly: 'Free forever',
      yearly: 'Free forever',
    },
    description:
      'Perfect for developers building their first AI SaaS application.',
    features: [
      'Complete AI SaaS template',
      'Authentication setup (Clerk)',
      'Database integration (Supabase)',
      'Payment processing (Polar)',
      'Community support',
    ],
    cta: 'Get started for free',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: {
      monthly: 29,
      yearly: 25,
    },
    description: 'Everything you need to scale your AI SaaS business.',
    features: [
      'All Starter features',
      'Premium UI components',
      'AI model integrations',
      'Advanced analytics',
      'Priority email support',
      'API documentation',
    ],
    cta: 'Subscribe to Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: {
      monthly: 'Get in touch for pricing',
      yearly: 'Get in touch for pricing',
    },
    description: 'Advanced features for large AI SaaS applications and teams.',
    features: [
      'All Professional features',
      'Custom AI integrations',
      'White-label solutions',
      'Dedicated support',
      'SLA guarantees',
      'On-premise deployment',
    ],
    cta: 'Contact us',
  },
];

const Pricing2 = () => {
  const [frequency, setFrequency] = useState<string>('monthly');

  return (
    <div id="pricing" className="not-prose flex flex-col gap-12 px-(--container-padding-x) py-(--section-padding-y) text-center bg-muted/30">
      <div className="flex flex-col items-center justify-center gap-6">
        <h2 className="mb-0 text-balance font-semibold text-4xl md:text-5xl leading-[1.15] tracking-tighter text-foreground">
          AI SaaS Pricing
        </h2>
        <p className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-xl text-muted-foreground leading-relaxed">
          Building an AI SaaS should be simple. Our pricing plans are straightforward,
          transparent, and designed to scale with your success.
        </p>
        <Tabs defaultValue={frequency} onValueChange={setFrequency}>
          <TabsList className="h-11 px-1 bg-muted/60 backdrop-blur-sm border border-border shadow-sm">
            <TabsTrigger value="monthly" className="px-6 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="px-6 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">
              Yearly
              <Badge variant="outline" className="ml-2 text-xs font-semibold border-primary text-primary">20% off</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-8 grid w-full max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              className={cn(
                'relative w-full flex flex-col rounded-xl overflow-hidden',
                plan.popular
                  ? 'bg-primary/5 dark:bg-linear-to-b dark:from-primary/20 dark:via-primary/15 dark:to-primary/10 border border-primary/20 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_50px_-15px_rgba(255,255,255,0.1)] transform scale-105'
                  : 'bg-card border border-border shadow-[0_12px_50px_-15px_rgba(0,0,0,0.1)]'
              )}
              key={plan.id}
            >
              {/* Header with Badge */}
              <div className={cn(
                'px-6 pt-4 pb-2',
                plan.popular ? '' : 'bg-card'
              )}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className={cn(
                    'text-2xl font-bold tracking-tight text-left',
                    plan.popular ? 'text-foreground' : 'text-foreground'
                  )}>
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <Badge className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-md border-0">
                      Best value
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  'text-sm leading-relaxed text-left',
                  plan.popular ? 'text-muted-foreground' : 'text-muted-foreground'
                )}>
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className={cn(
                'px-6 py-2',
                plan.popular ? '' : ''
              )}>
                {typeof plan.price[frequency as keyof typeof plan.price] === 'number' ? (
                  <div className="flex flex-col items-start">
                    <div className="flex items-baseline gap-1">
                      <NumberFlow
                        className={cn(
                          'text-5xl font-bold tracking-tighter',
                          plan.popular ? 'text-foreground' : 'text-foreground'
                        )}
                        format={{
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 2,
                        }}
                        value={plan.price[frequency as keyof typeof plan.price] as number}
                      />
                      <span className={cn(
                        'text-base',
                        plan.popular ? 'text-muted-foreground' : 'text-muted-foreground'
                      )}>
                        per month
                      </span>
                    </div>
                    <p className={cn(
                      'text-xs',
                      plan.popular ? 'text-muted-foreground' : 'text-muted-foreground'
                    )}>
                      per user / month, when paying {frequency}
                    </p>
                  </div>
                ) : (
                  <div className={cn(
                    'text-2xl font-semibold text-left',
                    plan.popular ? 'text-foreground' : 'text-foreground'
                  )}>
                    {plan.price[frequency as keyof typeof plan.price]}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className={cn(
                'px-6 py-3',
                plan.popular ? '' : 'bg-card'
              )}>
                <Button
                  className={cn(
                    'w-full py-4 rounded-md text-base font-semibold transition-all duration-200 items-center gap-2',
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                  )}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Features List */}
              <div className={cn(
                'px-6 py-4 flex-1',
                plan.popular ? '' : 'bg-muted/30'
              )}>
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <svg
                          className={cn(
                            'w-5 h-5',
                            plan.popular ? 'text-foreground' : 'text-foreground'
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className={cn(
                        'text-sm leading-relaxed',
                        plan.popular ? 'text-foreground' : 'text-foreground'
                      )}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing2;