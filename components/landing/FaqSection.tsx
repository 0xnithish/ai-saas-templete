import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";

const faq = [
  {
    question: "What AI models can I integrate with this template?",
    answer:
      "The template is designed to work with any AI model API including OpenAI, Anthropic Claude, Google AI, and custom models. You can easily integrate multiple AI providers and switch between them based on your needs and costs.",
  },
  {
    question: "Can I customize the authentication flow?",
    answer:
      "Yes! The template uses Clerk authentication which supports extensive customization including social logins (Google, GitHub, Discord), enterprise SSO, multi-factor authentication, and custom user attributes. You can fully brand the auth experience.",
  },
  {
    question: "How do I add my own AI features?",
    answer:
      "The template provides a clean architecture for adding AI features. Create API routes for your AI logic, add components for the UI, and connect to your preferred AI providers. The documentation includes step-by-step guides for common AI features.",
  },
  {
    question: "What hosting providers are supported?",
    answer:
      "The template works with any hosting provider that supports Next.js applications. Vercel is recommended for the best experience, but it also works perfectly on Netlify, Railway, DigitalOcean, AWS, Google Cloud, and traditional VPS hosting.",
  },
  {
    question: "Can I use this with existing AI services?",
    answer:
      "Absolutely! The template is provider-agnostic. Whether you're using existing AI APIs, running your own models, or planning to switch providers in the future, the architecture supports easy integration and migration between different AI services.",
  },
  {
    question: "What's included in the free template vs premium add-ons?",
    answer:
      "The free MIT-licensed template includes all core features: authentication, payments, database, UI components, and deployment setup. Premium add-ons (coming soon) will include pre-built AI integrations, analytics dashboards, email automation, and advanced components to accelerate development even further.",
  },
  {
    question: "How long does it take to set up and deploy?",
    answer:
      "Initial setup takes 15-30 minutes: clone the repo, configure environment variables for Clerk, Polar, and Supabase, and you're ready to develop. Deployment to production typically takes 5-10 minutes on Vercel. Most developers have a functional AI SaaS running within their first day.",
  },
  {
    question: "Do I need to be an expert in React/Next.js?",
    answer:
      "Basic React and Next.js knowledge is helpful, but the template is extensively documented and includes examples for common patterns. It's designed to be a learning resource as well as a production foundation, perfect for developers looking to build AI applications.",
  },
];

const FAQ = () => {
  return (
    <div id="faq" className="min-h-screen flex items-center justify-center px-(--container-padding-x) py-(--section-padding-y)">
      <div className="w-full max-w-2xl">
        <h2 className="text-4xl md:text-5xl leading-[1.15] font-semibold tracking-tighter">
          AI SaaS Template FAQs
        </h2>
        <p className="mt-2 text-xl text-muted-foreground">
          Everything you need to know about building your AI SaaS with this template.
        </p>

        <Accordion
          type="single"
          collapsible
          className="mt-8 sm:mt-10 space-y-4"
          defaultValue="question-0"
        >
          {faq.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`question-${index}`}
              className="border border-border/50 rounded-lg px-6 py-2 bg-background/50 hover:bg-accent/50 transition-colors"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={cn(
                    "flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all [&[data-state=open]>svg]:rotate-45 cursor-pointer",
                    "text-start text-lg"
                  )}
                >
                  {question}
                  <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
