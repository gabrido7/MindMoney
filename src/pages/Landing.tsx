import LandingNavbar from "../features/landing/components/LandingNavbar";
import HeroSection from "../features/landing/components/HeroSection";
import FeaturesSection from "../features/landing/components/FeaturesSection";
import TrailsSection from "../features/landing/components/TrailsSection";
import TestimonialsSection from "../features/landing/components/TestimonialsSection";
import CreatorsSection from "../features/landing/components/CreatorsSection";
import PricingSection from "../features/landing/components/PricingSection";
import FaqSection from "../features/landing/components/FaqSection";
import NewsletterFooter from "../features/landing/components/NewsletterFooter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TrailsSection />
        <TestimonialsSection />
        <CreatorsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <NewsletterFooter />
    </div>
  );
}
