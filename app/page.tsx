import HeroHome from "@/components/hero-home";
import ExploraSection from "@/components/explora-section";
import AliadosSection from "@/components/aliados-section";
import TestimonialsSection from "@/components/testimonials-section";

export default function Home() {
  return (
    <main>
      <HeroHome />
      <ExploraSection />
      <AliadosSection />
      <TestimonialsSection />
    </main>
  );
}
