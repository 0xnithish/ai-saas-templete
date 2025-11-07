"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CtaSection() {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-4xl overflow-hidden border-primary bg-primary text-primary-foreground">
          <CardHeader className="pb-3 pt-6 text-center sm:pb-4 sm:pt-8 md:pb-6 md:pt-12">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 sm:h-12 sm:w-12">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <CardTitle className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">
              Ready to transform your business with AI?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 pb-6 text-center sm:gap-6 md:pb-8 md:pb-12">
            <p className="max-w-2xl text-sm text-primary-foreground/90 sm:text-base">
              Join thousands of companies already using our platform to automate
              workflows, boost productivity, and scale their operations.
            </p>
            <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" asChild className="gap-2 w-full sm:w-auto">
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}