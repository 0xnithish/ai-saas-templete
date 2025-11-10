import Header from "@/components/navigation/Header"
import Hero from "@/components/landing/Hero"
import LogoCloud from "@/components/landing/LogoCloud"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import Pricing2 from "@/components/landing/PricingSection"
import Testimonials from "@/components/landing/Testimonials"
import FaqSection from "@/components/landing/FaqSection"
import CtaSection from "@/components/landing/CtaSection"
import FooterSection from "@/components/landing/FooterSection"
import AnnouncementBar from "@/components/landing/AnnouncementBar"
import Features from "@/components/landing/Features"

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