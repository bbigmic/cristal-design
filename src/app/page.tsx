import Navigation from "@/components/navigation";
import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import ProductsSection from "@/components/sections/products-section";
import ContactSection from "@/components/sections/contact-section";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}