"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CtaSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-4xl overflow-hidden border-primary bg-primary text-primary-foreground">
          <CardHeader className="pb-4 pt-8 text-center md:pb-6 md:pt-12">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/10">
              <Sparkles className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to transform your business with AI?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6 pb-8 text-center md:pb-12">
            <p className="max-w-2xl text-sm text-primary-foreground/90 sm:text-base">
              Join thousands of companies already using our platform to automate
              workflows, boost productivity, and scale their operations.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" asChild className="gap-2">
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
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