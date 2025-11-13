interface Feature {
  title: string;
  description: string;
  image: string;
}

interface FeaturesProps {
  title?: string;
  description?: string;
  feature1?: Feature;
  feature2?: Feature;
  feature3?: Feature;
  feature4?: Feature;
  feature5?: Feature;
}

const Features = ({
  title = "Complete AI SaaS Foundation",
  description = "Production-ready template with authentication and database pre-configured. Just add your environment variables and start building your AI SaaS in minutes, not months.",
  feature1 = {
    title: "🔐 Enterprise-Ready Authentication",
    description:
      "Skip weeks of auth setup with pre-configured Clerk authentication. Support for social providers, SSO, and protected routes out of the box.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  },
  feature2 = {
    title: "🗄️ Scalable Database Infrastructure",
    description:
      "Production-grade Supabase PostgreSQL with real-time subscriptions, row-level security, and automatic backups. Scales from MVP to enterprise.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
  },
  feature3 = {
    title: "🚀 Rapid Development & Deployment",
    description:
      "Get to market faster with pre-configured deployment pipelines, environment management, and production optimizations. Focus on building your unique features.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
  },
  feature4 = {
    title: "🎨 Modern UI Component Library",
    description:
      "50+ beautiful shadcn/ui components built with Radix UI primitives. Accessible, customizable, and consistent design system that impresses users.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
  },
  feature5 = {
    title: "⚡ Developer Experience & Performance",
    description:
      "Lightning-fast development with Next.js 16, Turbopack, and TypeScript. Optimized build pipeline and production-ready performance.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-5.svg",
  },
}: FeaturesProps) => {
  return (
    <section id="features" className="py-(--section-padding-y-lg)">
      <div className="container max-w-(--container-max-w) mx-auto px-(--container-padding-x)">
        <div className="mb-16 flex flex-col items-center gap-6">
          <h2 className="text-center text-4xl md:text-5xl leading-[1.15] font-semibold tracking-tighter lg:max-w-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-center text-xl lg:max-w-4xl">
            {description}
          </p>
        </div>
        <div className="relative flex justify-center">
          <div className="w-full lg:max-w-6xl">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="border-border flex flex-col justify-between rounded-(--card-radius-lg) border bg-background p-8 lg:w-1/3 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_60px_-20px_rgba(0,0,0,0.15)] transition-all duration-300">
                <h3 className="text-lg font-semibold tracking-tight">{feature1.title}</h3>
                <p className="text-muted-foreground text-base">{feature1.description}</p>
                <img
                  src={feature1.image}
                  alt={feature1.title}
                  className="mt-8 aspect-[1.5] h-full w-full rounded-(--card-radius) object-cover"
                />
              </div>
              <div className="border-border flex flex-col justify-between rounded-(--card-radius-lg) border bg-background p-8 lg:w-1/3 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_60px_-20px_rgba(0,0,0,0.15)] transition-all duration-300">
                <h3 className="text-lg font-semibold tracking-tight">{feature2.title}</h3>
                <p className="text-muted-foreground text-base">{feature2.description}</p>
                <img
                  src={feature2.image}
                  alt={feature2.title}
                  className="mt-8 aspect-[1.45] h-full w-full rounded-(--card-radius) object-cover"
                />
              </div>
              <div className="border-border flex flex-col justify-between rounded-(--card-radius-lg) border bg-background p-8 lg:w-1/3 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_60px_-20px_rgba(0,0,0,0.15)] transition-all duration-300">
                <h3 className="text-lg font-semibold tracking-tight">{feature3.title}</h3>
                <p className="text-muted-foreground text-base">{feature3.description}</p>
                <img
                  src={feature3.image}
                  alt={feature3.title}
                  className="mt-8 aspect-[1.45] h-full w-full rounded-(--card-radius) object-cover"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-6 lg:flex-row">
              <div className="border-border flex flex-col rounded-(--card-radius-lg) border bg-background p-8 lg:w-1/2 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_60px_-20px_rgba(0,0,0,0.15)] transition-all duration-300">
                <h3 className="text-lg font-semibold tracking-tight">{feature4.title}</h3>
                <p className="text-muted-foreground text-base">{feature4.description}</p>
                <img
                  src={feature4.image}
                  alt={feature4.title}
                  className="mt-6 aspect-[2.5] h-72 w-full rounded-(--card-radius) object-cover"
                />
              </div>
              <div className="border-border flex flex-col rounded-(--card-radius-lg) border bg-background p-8 lg:w-1/2 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_60px_-20px_rgba(0,0,0,0.15)] transition-all duration-300">
                <h3 className="text-lg font-semibold tracking-tight">{feature5.title}</h3>
                <p className="text-muted-foreground text-base">{feature5.description}</p>
                <img
                  src={feature5.image}
                  alt={feature5.title}
                  className="mt-6 aspect-[2.5] h-72 w-full rounded-(--card-radius) object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
