import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Sign Up",
      description:
        "Create your account in seconds with just your email. No credit card required to get started.",
      imageText: "Image Placeholder",
    },
    {
      id: 2,
      title: "Configure",
      description:
        "Customize the AI settings to match your workflow. Set preferences and integrate with your tools.",
      imageText: "Image Placeholder",
    },
    {
      id: 3,
      title: "Start Building",
      description:
        "Begin creating with our intuitive interface. Launch your first project and see results immediately.",
      imageText: "Image Placeholder",
    },
  ]

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <h2 className="text-pretty text-4xl font-semibold lg:text-6xl">
            How it works
          </h2>
          <p className="text-muted-foreground lg:text-xl">
            Launch in minutes with a guided workflow that keeps every decision clear and every step actionable.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.id} className="flex h-full flex-col overflow-hidden pt-0">
              <div className="aspect-video w-full bg-muted">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {step.imageText}
                  </span>
                </div>
              </div>
              <CardHeader className="flex flex-col gap-4">
                <Badge variant="secondary" className="w-fit px-3 py-1 text-xs uppercase tracking-wide">
                  Step {step.id}
                </Badge>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}