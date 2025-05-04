import Header from '@/src/app/components/layout/Header';
import HeroSection from '@/src/app/components/propertyListing/HeroSection';
import PropertyGrid from '@/src/app/components/propertyListing/PropertyGrid';
import Pagination from '@/src/app/components/propertyListing/Pagination';

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-900/20 to-purple-900/40'>
      <Header />
      {/* Hero Section */}
      <HeroSection />
      <PropertyGrid />
      <Pagination />
    </main>
  );
}
