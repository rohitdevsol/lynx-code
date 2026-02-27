import { BackgroundSystem } from "../components/landing/BackgroundSystem";
import { Navbar } from "../components/landing/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { LiveDemoSection } from "../components/landing/LiveDemoSection";
import { TrustSection } from "../components/landing/TrustSection";
import { Footer } from "../components/landing/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black selection:bg-lynx-primary/30 selection:text-white">
      <BackgroundSystem />
      <Navbar />
      <main className="flex flex-col relative z-10 w-full overflow-hidden">
        <HeroSection />
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-10 max-w-7xl mx-auto" />
        <FeaturesSection />
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-10 max-w-7xl mx-auto" />
        <HowItWorksSection />
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-10 max-w-7xl mx-auto" />
        <LiveDemoSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}
