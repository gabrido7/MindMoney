import LandingNavbar from "../features/landing/components/LandingNavbar";
import HeroSection from "../features/landing/components/HeroSection";
import FeaturesSection from "../features/landing/components/FeaturesSection";
import TestimonialsSection from "../features/landing/components/TestimonialsSection";
import PricingSection from "../features/landing/components/PricingSection";
import FaqSection from "../features/landing/components/FaqSection";
import NewsletterFooter from "../features/landing/components/NewsletterFooter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <NewsletterFooter />
    </div>
  );
}
