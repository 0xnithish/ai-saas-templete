import DottedLine from "@/components/shared/DottedLine"

export default function HowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Clone the Repo",
      description: "Get a clean, local copy of the codebase. No complex installers.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    },
    {
      id: 2,
      title: "Add Your Keys",
      description: "Open the .env.local.example file, rename it, and paste in your credentials.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
    },
    {
      id: 3,
      title: "Run the Dev Server",
      description: "That's it. Your new app is running locally with a database, authentication, and payments ready to go.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
    },
  ]

  return (
    <section id="how-it-works" className="px-6 py-24 bg-muted">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-8">
            The 5-Minute Promise
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Here's The Workflow. <span className="text-foreground font-medium">All Of It.</span> This isn't an exaggeration. This is the <em>entire</em> setup process.
          </p>
        </div>

        <div className="relative">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10">
                <div className="text-center px-4">
                  <div className="relative inline-block mb-8">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-80 h-44 rounded-xl object-cover mx-auto shadow-lg"
                    />
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold border-4 border-background shadow-md">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
                {/* Dotted line connector between cards */}
                {index < steps.length - 1 && (
                  <DottedLine
                    className="hidden lg:block absolute top-20 left-1/2 w-full h-16 text-muted-foreground pointer-events-none -z-10"
                    inverted={index === 1}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}