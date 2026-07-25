import HeroSection from "@/app/_components/home/HeroSection";
import FeaturesBar from "./_components/home/FeatureBar";
import CategoryGrid from "./_components/home/CategoryGrid";
import FeaturedProducts from "./_components/home/FeaturedProducts";
import TestimonialsSection from "./_components/home/TestimonialsSection";
import { getHeroSlides } from "@/app/_lib/data-service";

export const revalidate = 3600;

export default async function Home() {
  const slides = await getHeroSlides();

  return (
    <main>
      <HeroSection slides={slides} />
      <FeaturesBar />
      <CategoryGrid />
      <FeaturedProducts />
      <TestimonialsSection />
    </main>
  );
}
