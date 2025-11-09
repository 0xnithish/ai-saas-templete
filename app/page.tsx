import Header from "@/components/navigation/Header"
import Hero from "@/components/marketing/Hero"
import LogoCloud from "@/components/marketing/LogoCloud"
import HowItWorksSection from "@/components/marketing/HowItWorksSection"
import Pricing2 from "@/components/marketing/PricingSection"
import Testimonials from "@/components/marketing/Testimonials"
import FaqSection from "@/components/marketing/FaqSection"
import CtaSection from "@/components/marketing/CtaSection"
import FooterSection from "@/components/marketing/FooterSection"
import AnnouncementBar from "@/components/marketing/AnnouncementBar"
import Features from "@/components/marketing/Features"

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorksSection />
      <Pricing2 />
      <Testimonials />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </>
  )
}