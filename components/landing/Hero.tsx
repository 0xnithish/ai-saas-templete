import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full flex flex-col gap-16 items-center justify-center px-6 py-[var(--section-padding-y-sm)]">
      <div className="text-center max-w-4xl mx-auto">
        <Badge
          variant="secondary"
          className="rounded-full py-1 border-border"
          asChild
        >
          <Link href="#">
            Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl leading-[1.15] font-semibold tracking-tighter">
          Customized Shadcn UI Blocks & Components
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore a collection of Shadcn UI blocks and components, ready to
          preview and copy. Streamline your development workflow with
          easy-to-implement examples.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Get Started <ArrowUpRight className="h-5! w-5!" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="h-5! w-5!" /> Watch Demo
          </Button>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto aspect-video bg-accent rounded-[var(--card-radius-xl)] overflow-hidden">
        <Image
          src="/hero/screenshot.webp"
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
