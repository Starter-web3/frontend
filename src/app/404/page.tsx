'use client';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function NotFound() {
  return (
    <div className='pt-36 pb-20 min-h-screen flex flex-col bg-[#170129] text-white relative overflow-hidden'>
      {/* Header */}
      <Header />

      {/* Background Aura */}
      <div className='absolute inset-0 z-0'>
        <div
          className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-30'
          style={{
            background: 'radial-gradient(circle, rgba(196,77,255,0.3) 0%, rgba(23,1,41,1) 80%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      {/* Main Content */}
      <main className='flex-grow flex flex-col items-center justify-center relative z-10 px-4 mt-20 mb-28'>
        {/* Error Message */}
        <p className='font-inter font-normal text-lg text-center text-[#C7C7CC] mb-4'>
          We can&apos;t find the page you&apos;re looking for :(
        </p>

        {/* 404 Text */}
        <h1 className='font-poppins font-bold text-[150px] leading-none text-center text-white tracking-tight'>
          404
        </h1>
      </main>

      <div
        className='absolute center-0 left-1/2 transform -translate-x-1/2 w-[1200px] h-[600px] rounded-full z-0'
        // style={{
        //   background: 'radial-gradient(circle at 50% 30%, rgba(196, 77, 255, 0.8), rgba(23, 1, 41, 1))',
        //   filter: 'blur(80px)',
        // }}
      />

      {/* Footer */}
      <Footer />

      {/* Background Gradient */}
    </div>
  );
}
