import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How it works
          </h2>
        </div>

        {/* Steps Grid with connecting arrows */}
        <div className="grid grid-cols-11 gap-4 items-center max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="col-span-3">
            <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border pb-6 shadow-sm w-full pt-0">
              {/* Placeholder Image Area */}
              <div className="aspect-video bg-muted rounded-t-lg">
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    {steps[0].imageText}
                  </p>
                </div>
              </div>

              <CardHeader className="space-y-3">
                {/* Step Number Button */}
                <Button variant="secondary" size="sm" className="w-20">
                  Step {steps[0].id}
                </Button>

                {/* Title */}
                <CardTitle className="text-2xl">{steps[0].title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">{steps[0].description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Arrow between Step 1 and Step 2 */}
          <div className="col-span-1 flex justify-center">
            <ArrowRight className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Step 2 */}
          <div className="col-span-3">
            <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border pb-6 shadow-sm w-full pt-0">
              {/* Placeholder Image Area */}
              <div className="aspect-video bg-muted rounded-t-lg">
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    {steps[1].imageText}
                  </p>
                </div>
              </div>

              <CardHeader className="space-y-3">
                {/* Step Number Button */}
                <Button variant="secondary" size="sm" className="w-20">
                  Step {steps[1].id}
                </Button>

                {/* Title */}
                <CardTitle className="text-2xl">{steps[1].title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">{steps[1].description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Arrow between Step 2 and Step 3 */}
          <div className="col-span-1 flex justify-center">
            <ArrowRight className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Step 3 */}
          <div className="col-span-3">
            <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border pb-6 shadow-sm w-full pt-0">
              {/* Placeholder Image Area */}
              <div className="aspect-video bg-muted rounded-t-lg">
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    {steps[2].imageText}
                  </p>
                </div>
              </div>

              <CardHeader className="space-y-3">
                {/* Step Number Button */}
                <Button variant="secondary" size="sm" className="w-20">
                  Step {steps[2].id}
                </Button>

                {/* Title */}
                <CardTitle className="text-2xl">{steps[2].title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">{steps[2].description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}