import MainLayout from '@/components/layout/main-layout';
import HeroSection from '@/components/home/hero-section';
import CategoriesSection from '@/components/home/categories-section';
import FeaturedProducts from '@/components/home/featured-products';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
    </MainLayout>
  );
}