import Header from "@/components/Header"
import Hero from "@/components/Hero"
import LogoCloud from "@/components/LogoCloud"
import BenefitsSection from "@/components/BenefitsSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import Pricing2 from "@/components/PricingSection"
import Testimonials from "@/components/Testimonials"
import FaqSection from "@/components/FaqSection"
import CtaSection from "@/components/CtaSection"
import FooterSection from "@/components/FooterSection"
import AnnouncementBar from "@/components/AnnouncementBar"

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Hero />
      <LogoCloud />
      <BenefitsSection />
      <HowItWorksSection />
      <Pricing2 />
      <Testimonials />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </>
  )
}