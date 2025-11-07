"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "Tech Corp",
      text: "This platform has completely transformed our workflow. The AI capabilities are incredible and have saved us countless hours.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CEO",
      company: "StartupXYZ",
      text: "Incredible results from day one. The user interface is intuitive and the features are exactly what we needed.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Designer",
      company: "Creative Studio",
      text: "Best investment we've made for our team. The collaboration features are top-notch and easy to use.",
      rating: 5,
    },
    {
      id: 4,
      name: "David Kim",
      role: "Developer",
      company: "DevWorks",
      text: "The API documentation is excellent and the integration was seamless. Highly recommend to other developers.",
      rating: 5,
    },
    {
      id: 5,
      name: "Lisa Anderson",
      role: "Marketing Director",
      company: "Growth Co",
      text: "Our productivity has increased by 300% since using this tool. The customer support team is also amazing.",
      rating: 5,
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Founder",
      company: "InnovateLabs",
      text: "This product has exceeded all our expectations. The features are robust and the performance is outstanding.",
      rating: 5,
    },
    {
      id: 7,
      name: "Maria Garcia",
      role: "Project Manager",
      company: "BuildRight",
      text: "Game-changer for our team! The automation features have streamlined our entire process.",
      rating: 5,
    },
    {
      id: 8,
      name: "Tom Brown",
      role: "CTO",
      company: "TechStart",
      text: "The security features give us peace of mind. The platform is reliable and has never let us down.",
      rating: 5,
    },
    {
      id: 9,
      name: "Jennifer Lee",
      role: "Operations Manager",
      company: "ScaleUp Inc",
      text: "We've tried many similar tools, but this one stands out. The analytics and reporting are comprehensive.",
      rating: 5,
    },
    {
      id: 10,
      name: "Robert Taylor",
      role: "Team Lead",
      company: "NextGen Solutions",
      text: "The learning curve was minimal and the impact was immediate. Our team loves using this platform daily.",
      rating: 5,
    },
  ]

  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-primary text-primary" : "fill-none text-muted-foreground"
        }`}
      />
    ))
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Loved by people worldwide
          </h2>
        </div>

        {/* Auto-scrolling Testimonials */}
        <div className="relative -mx-6 sm:-mx-8 md:-mx-12 lg:-mx-16">
          {/* Gradient masks for fade effect */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-gray-50 to-transparent"></div>
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-gray-50 to-transparent"></div>

          {/* Scrolling container */}
          <div className="flex animate-scroll-horizontal gap-4 sm:gap-6">
            {duplicatedTestimonials.map((testimonial, index) => (
              <Card
                key={`${testimonial.id}-${index}`}
                className="w-[300px] flex-shrink-0 sm:w-[350px] md:w-[400px]"
              >
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="mb-4 flex gap-1">{renderStars(testimonial.rating)}</div>

                  {/* Testimonial Text */}
                  <p className="mb-6 text-sm text-muted-foreground">
                    "{testimonial.text}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}