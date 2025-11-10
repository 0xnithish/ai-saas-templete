'use client';

import NumberFlow from '@number-flow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const plans = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: {
      monthly: 'Free forever',
      yearly: 'Free forever',
    },
    description:
      'The perfect starting place for your web app or personal project.',
    features: [
      '50 API calls / month',
      '60 second checks',
      'Single-user account',
      '5 monitors',
      'Basic email support',
    ],
    cta: 'Get started for free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: {
      monthly: 90,
      yearly: 75,
    },
    description: 'Everything you need to build and scale your business.',
    features: [
      'Unlimited API calls',
      '30 second checks',
      'Multi-user account',
      '10 monitors',
      'Priority email support',
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
    description: 'Critical security, performance, observability and support.',
    features: [
      'You can DDOS our API.',
      'Nano-second checks.',
      'Invite your extended family.',
      'Unlimited monitors.',
      "We'll sit on your desk.",
    ],
    cta: 'Contact us',
  },
];

const Pricing2 = () => {
  const [frequency, setFrequency] = useState<string>('monthly');

  return (
    <div className="not-prose flex flex-col gap-12 px-[var(--container-padding-x)] py-[var(--section-padding-y)] text-center bg-muted/30">
      <div className="flex flex-col items-center justify-center gap-6">
        <h2 className="mb-0 text-balance font-semibold text-4xl md:text-5xl leading-[1.15] tracking-tighter text-foreground">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-xl text-muted-foreground leading-relaxed">
          Managing a business is hard enough, so why not make your life easier?
          Our pricing plans are simple, transparent and scale with you.
        </p>
        <Tabs defaultValue={frequency} onValueChange={setFrequency}>
          <TabsList className="h-11 px-1 bg-muted/60 backdrop-blur-sm border border-border shadow-sm">
            <TabsTrigger value="monthly" className="px-6 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="px-6 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">
              Yearly
              <Badge variant="outline" className="ml-2 text-xs font-semibold border-border text-muted-foreground">20% off</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-8 grid w-full max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              className={cn(
                'relative w-full flex flex-col',
                plan.popular
                  ? 'bg-gray-900 rounded-[var(--card-radius-xl)] p-2 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.25)] transform scale-105'
                  : 'bg-card rounded-[var(--card-radius-xl)] p-2 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.1)] border border-border'
              )}
              key={plan.id}
            >
              <div className={cn(
                'rounded-[var(--card-radius-lg)] p-6 mb-2 flex-grow flex flex-col',
                plan.popular ? 'bg-gray-800' : 'bg-card'
              )}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className={cn(
                    'text-[var(--heading-3)] font-bold tracking-tight',
                    plan.popular ? 'text-white' : 'text-foreground'
                  )}>
                    {plan.name}
                  </h3>
                  {plan.popular ? (
                    <Badge className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full border-0">
                      Most Popular
                    </Badge>
                  ) : (
                    <Badge className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      Popular
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  'text-base leading-relaxed mb-6 text-left',
                  plan.popular ? 'text-gray-400' : 'text-muted-foreground'
                )}>
                  {plan.description}
                </p>
                <div className="flex items-baseline mb-6">
                  {typeof plan.price[frequency as keyof typeof plan.price] === 'number' ? (
                    <>
                      <NumberFlow
                        className={cn(
                          'text-4xl font-bold tracking-tighter',
                          plan.popular ? 'text-white' : 'text-foreground'
                        )}
                        format={{
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }}
                        value={plan.price[frequency as keyof typeof plan.price] as number}
                      />
                      <span className={cn(
                        'text-xl ml-2',
                        plan.popular ? 'text-gray-400' : 'text-muted-foreground'
                      )}>
                        /{frequency}
                      </span>
                    </>
                  ) : (
                    <div className={cn(
                      'text-xl leading-relaxed',
                      plan.popular ? 'text-white' : 'text-foreground'
                    )}>
                      {plan.price[frequency as keyof typeof plan.price]}
                    </div>
                  )}
                </div>
                <Button
                  className={cn(
                    'w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.2)]',
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  )}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              <div className={cn(
                'flex-grow flex flex-col px-4 pb-4 pt-3',
                plan.popular ? 'bg-gray-900' : 'bg-muted'
              )}>
                <div className="grid grid-cols-1 gap-y-2 mb-auto">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={cn(
                        'w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center',
                        plan.popular
                          ? 'bg-white/20'
                          : 'bg-foreground'
                      )}>
                        <svg
                          className="w-2 h-2"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke={plan.popular ? "white" : "background"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className={cn(
                        'text-[var(--body-sm)] font-medium leading-relaxed text-left',
                        plan.popular ? 'text-gray-300' : 'text-muted-foreground'
                      )}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-[var(--body-sm)]">
                    <span className={plan.popular ? 'text-gray-400' : 'text-muted-foreground'}>
                      Support Level:
                    </span>
                    <span className={cn(
                      'font-semibold',
                      plan.popular ? 'text-white' : 'text-foreground'
                    )}>
                      {plan.id === 'hobby' ? 'Basic' : plan.id === 'pro' ? 'Priority' : 'Dedicated'}
                    </span>
                  </div>
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