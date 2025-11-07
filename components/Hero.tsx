import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Social Proof - moved above title */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                <div className="h-8 w-8 rounded-full bg-primary/30"></div>
                <div className="h-8 w-8 rounded-full bg-primary/40"></div>
              </div>
              <span className="font-medium text-foreground">1,200+</span>
              <span>active users</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Build the Future with{" "}
                <span className="text-primary">AI-Powered</span>{" "}
                Solutions
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg md:text-xl">
                Transform your business with cutting-edge AI technology.
                Streamline workflows, boost productivity, and unlock new
                possibilities with our intuitive platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link href="/demo">
                  <Play className="h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative order-first md:order-last">
            <div className="aspect-video rounded-lg bg-muted shadow-lg">
              {/* Placeholder content with icon */}
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm sm:h-16 sm:w-16">
                    <Play className="h-6 w-6 text-muted-foreground sm:h-8 sm:w-8" />
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Product Video / Screenshot
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements - Hidden on mobile */}
            <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-primary/5 blur-3xl hidden md:block"></div>
            <div className="absolute -bottom-8 -left-4 h-72 w-72 rounded-full bg-primary/5 blur-3xl hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  )
}