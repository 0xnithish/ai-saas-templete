"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqSection() {
  const faqs = [
    {
      id: "item-1",
      question: "What is AI-Powered Solutions?",
      answer:
        "AI-Powered Solutions is a cutting-edge platform that leverages artificial intelligence to streamline your business processes, automate repetitive tasks, and provide intelligent insights to help you make data-driven decisions faster and more efficiently.",
    },
    {
      id: "item-2",
      question: "How do I get started with the platform?",
      answer:
        "Getting started is easy! Simply sign up for an account, choose your plan, and follow our quick setup guide. Our intuitive interface will walk you through the initial configuration, and you'll be up and running in just a few minutes with our helpful tutorials and documentation.",
    },
    {
      id: "item-3",
      question: "Can I integrate it with my existing tools?",
      answer:
        "Absolutely! Our platform offers seamless integration with over 100 popular business tools and services including Slack, Microsoft Teams, Salesforce, HubSpot, and many more. We also provide a robust API and webhook support for custom integrations.",
    },
    {
      id: "item-4",
      question: "What kind of support do you provide?",
      answer:
        "We offer multiple support channels to ensure your success. All plans include access to our comprehensive documentation and knowledge base. Professional and Enterprise plans include priority email support, live chat, and phone support during business hours.",
    },
    {
      id: "item-5",
      question: "Is my data secure with AI-Powered Solutions?",
      answer:
        "Security is our top priority. We use enterprise-grade encryption, maintain SOC 2 compliance, and follow industry best practices for data protection. Your data is encrypted both in transit and at rest, and we never share your information with third parties. We also offer GDPR and CCPA compliance features.",
    },
  ]

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Find answers to common questions about our platform
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-lg border bg-background px-4 shadow-sm sm:px-6"
              >
                <AccordionTrigger className="hover:no-underline py-4 sm:py-6 text-left text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <p className="text-xs text-muted-foreground sm:text-sm">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}