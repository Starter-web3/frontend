'use client';
import { useEffect } from 'react';
import Hero from './components/home/Hero';
import StatsSection from './components/home/StatsSection';
import PropertyCardSlider from './components/ui/PropertyCardSlider';
import BlockChainFeatures from './components/home/BlockChainFeatures';
import WhyUs from './components/home/WhyUs';
import HowItWorks from './components/home/HowItWorks';
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
      <PropertyCardSlider />
      <BlockChainFeatures />
      <WhyUs />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </main>
  );
}
