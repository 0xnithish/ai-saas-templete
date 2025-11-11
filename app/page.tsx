import Header from "@/components/navigation/Header"
import Hero from "@/components/landing/Hero"
import LogoCloud from "@/components/landing/LogoCloud"
import Features from "@/components/landing/Features"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import ValueProposition from "@/components/landing/PricingSection"
import Testimonials from "@/components/landing/Testimonials"
import FaqSection from "@/components/landing/FaqSection"
import CtaSection from "@/components/landing/CtaSection"
import FooterSection from "@/components/landing/FooterSection"
import AnnouncementBar from "@/components/landing/AnnouncementBar"

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorksSection />
      <ValueProposition />
      <Testimonials />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </>
  )
}