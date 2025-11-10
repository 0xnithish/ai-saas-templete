import { Badge } from "@/components/ui/badge"
import { RocketIcon } from "lucide-react"

export default function HowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Clone the Repo",
      description: "Get a clean, local copy of the codebase. No complex installers.",
      duration: "30 seconds",
    },
    {
      id: 2,
      title: "Add Your Keys",
      description: "Open the .env.local.example file, rename it, and paste in your credentials.",
      duration: "2 minutes",
    },
    {
      id: 3,
      title: "Run the Dev Server",
      description: "That's it. Your new app is running locally with a database, authentication, and payments ready to go.",
      duration: "30 seconds",
    },
  ]

  return (
    <section id="how-it-works" className="px-4 py-20 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 mb-4">
            <RocketIcon className="w-3 h-3 mr-1" />
            The Solution
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            The 5-Minute Promise
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Here's The Workflow. <span className="text-foreground font-medium">All Of It.</span> This isn't an exaggeration. This is the <em>entire</em> setup process.
          </p>
        </div>

        <div className="relative">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`bg-card ${index === 1 ? '' : 'lg:mt-8'} rounded-2xl p-8 shadow-sm border border-border backdrop-blur transform relative z-10`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="mb-6">
                    <span className="text-6xl font-bold text-foreground">{step.id}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border-primary/20 ml-auto">
                    <span className="text-xs text-primary font-medium">{step.duration}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}