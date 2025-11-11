"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export default function CtaSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-12 sm:p-16 text-center shadow-2xl" style={{ backgroundColor: '#171717' }}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Work Smarter with AI?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Start today and see how Acme Inc. helps you finish projects faster, with clarity and focus at every step.
          </p>
          <Button size="lg" className="text-base">
            Get Started <ArrowUpRight className="h-5! w-5!" />
          </Button>
        </div>
      </div>
    </section>
  )
}