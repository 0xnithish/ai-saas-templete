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
  title = "Boost Your Strategy with Smart Features",
  description = "Powerful features designed to help you identify opportunities, build authority, and accelerate your growth with data-driven insights.",
  feature1 = {
    title: "Identify Opportunities",
    description:
      "Easily uncover untapped areas to explore and expand your reach effortlessly and effectively.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  },
  feature2 = {
    title: "Build Authority",
    description:
      "Create valuable content that resonates, inspires trust, and positions you as an expert.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
  },
  feature3 = {
    title: "Instant Insights",
    description:
      "Gain immediate, actionable insights with a quick glance, enabling fast decision-making.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
  },
  feature4 = {
    title: "Accelerate Growth",
    description:
      "Supercharge your growth by implementing strategies that drive results quickly and efficiently.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
  },
  feature5 = {
    title: "Smart Analytics",
    description:
      "Track performance metrics and gain deep insights into your progress with advanced analytics.",
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
