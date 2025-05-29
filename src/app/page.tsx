'use client';
// import { useEffect } from 'react';
import Hero from './components/home/Hero';
import StatsSection from './components/home/StatsSection';
import TokenTypesSlider from './components/ui/TokenTypesSlider';
import PlatformFeatures from '././components/home/PlatformFeatures';
import WhyUs from './components/home/WhyUs';
import HowItWorks from './components/home/HowItWorks';
import Pricing from './components/home/Pricing';
import CallToAction from './components/ui/CallToAction';
import Footer from './components/layout/Footer';
// import { inintAppkit } from './config/appkit';

export default function Home() {
  // useEffect(() => {
  //   inintAppkit();
  // }, []);

  return (
    <main className='min-h-screen bg-[#201726]'>
      <Hero />
      <StatsSection />
      <TokenTypesSlider />
      <PlatformFeatures />
      <WhyUs />
      <HowItWorks />
      <Pricing />
      <CallToAction />
      <Footer />
    </main>
  );
}
