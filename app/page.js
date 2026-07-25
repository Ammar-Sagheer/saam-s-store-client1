import HeroSection from "@/app/_components/home/HeroSection";
import FeaturesBar from "./_components/home/FeatureBar";
import CategoryGrid from "./_components/home/CategoryGrid";
import FeaturedProducts from "./_components/home/FeaturedProducts";
import TestimonialsSection from "./_components/home/TestimonialsSection";

export const revalidate = 3600;

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesBar />
      <CategoryGrid />
      <FeaturedProducts />
      <TestimonialsSection />
    </main>
  );
}
