import Header from "@/components/Header"
import Hero from "@/components/Hero"
import PartnersSection from "@/components/PartnersSection"
import BenefitsSection from "@/components/BenefitsSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import PricingSection from "@/components/PricingSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import FaqSection from "@/components/FaqSection"
import CtaSection from "@/components/CtaSection"
import FooterSection from "@/components/FooterSection"

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <PartnersSection />
      <BenefitsSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </>
  )
}