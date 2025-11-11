"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
export default function Hero() {

  return (
    <div className="relative min-h-screen w-full flex flex-col gap-16 items-center justify-center px-6 py-(--section-padding-y-sm)">
      <div className="text-center max-w-4xl mx-auto">
        <Badge
          variant="secondary"
          className="py-1 border-border bg-muted/50 hover:bg-muted/70"
          asChild
        >
          <Link href="https://github.com">
            [ <span className="font-semibold text-primary"> OPEN SOURCE </span> ] MIT License · Production Ready <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <div className="mt-6 text-center">
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-muted-foreground mb-4">
            The Complete AI SaaS Template
          </h2>
          <h1 className="text-2xl md:text-3xl lg:text-6xl leading-[1.15] font-semibold tracking-tighter">
            Ship Your AI Product in Days,<br/>Not Months!
          </h1>
        </div>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Production-ready foundation with authentication by Clerk, payments by Polar, and database by Supabase.
          Deploy your AI SaaS in minutes, not months.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" className="text-base" asChild>
            <Link href="https://github.com">Get Started Now <ArrowUpRight className="h-5! w-5!" /></Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-base shadow-none"
            asChild
          >
            <Link href="https://demo.example.com"><CirclePlay className="h-5! w-5!" /> View Live Demo</Link>
          </Button>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto aspect-video bg-accent rounded-(--card-radius-xl) overflow-hidden">
        <img
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
          alt="Screenshot"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Gradient overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-100 bg-linear-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
