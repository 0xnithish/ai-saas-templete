import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Rocket, Users, BarChart, Lock } from "lucide-react"

export default function BenefitsSection() {
  const benefits = [
    {
      id: 1,
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with our optimized AI algorithms and infrastructure.",
    },
    {
      id: 2,
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols to keep your data safe and compliant.",
    },
    {
      id: 3,
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "Quick Setup",
      description: "Get started in minutes with our intuitive setup process and comprehensive documentation.",
    },
    {
      id: 4,
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with powerful collaboration tools and real-time updates.",
    },
    {
      id: 5,
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Advanced Analytics",
      description: "Make data-driven decisions with comprehensive analytics and detailed insights.",
    },
    {
      id: 6,
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Privacy First",
      description: "Your data stays yours. Built with privacy-first architecture and GDPR compliance.",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Benefits
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 - Large card spanning full width on md, normal on lg */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {benefits[0].icon}
              </div>
              <CardTitle className="text-xl">{benefits[0].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefits[0].description}</p>
            </CardContent>
          </Card>

          {/* Card 2 - Large card spanning full width on md, normal on lg */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {benefits[1].icon}
              </div>
              <CardTitle className="text-xl">{benefits[1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefits[1].description}</p>
            </CardContent>
          </Card>

          {/* Card 3 - Spans full width on mobile and desktop */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {benefits[2].icon}
              </div>
              <CardTitle className="text-xl">{benefits[2].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefits[2].description}</p>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className="">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {benefits[3].icon}
              </div>
              <CardTitle className="text-xl">{benefits[3].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefits[3].description}</p>
            </CardContent>
          </Card>

          {/* Card 5 */}
          <Card className="">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {benefits[4].icon}
              </div>
              <CardTitle className="text-xl">{benefits[4].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefits[4].description}</p>
            </CardContent>
          </Card>

          {/* Card 6 */}
          <Card className="">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {benefits[5].icon}
              </div>
              <CardTitle className="text-xl">{benefits[5].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefits[5].description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}