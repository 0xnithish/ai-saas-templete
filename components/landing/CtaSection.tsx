"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function CtaSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-12 sm:p-16 text-center shadow-2xl" style={{ backgroundColor: '#171717' }}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Launch Your AI SaaS?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Start building your AI SaaS today with production-ready integrations, modern tech stack, and beautiful UI. Ship your product in days, not months.
          </p>
          <Button size="lg" className="text-base" asChild>
            <Link href="https://github.com">
              Get Started Now <ArrowUpRight className="h-5! w-5!" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}