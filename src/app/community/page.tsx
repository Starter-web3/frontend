"use client";
import { Button } from "@/src/ui/button";
import Footer from "@/src/app/components/layout/Footer";
import Header from "@/src/app/components/layout/Header";

export default function CommunityPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1E0C28] via-[#2A1A3D] to-[#3F2A5C] text-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-[#2A1A3D]/60 rounded-full px-4 py-2 mb-6 mt-4 animate-fadeInLeft">
            <span className="text-sm">Blockchain-Powered Community</span>
            <div className="ml-2 bg-[#0AACE6] rounded-full w-5 h-5 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3L5.5 8.5L3 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 animate-fadeInLeft">
            ProptyChain Community: Connect, Learn, Grow
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fadeInLeft" style={{ animationDelay: "200ms" }}>
            Our future community hub will connect property owners, investors, renters, and real estate professionals in Nigeria using blockchain technology.
          </p>
          <div className="flex justify-center">
            <Button
              disabled
              className="bg-gray-500 cursor-not-allowed hover:bg-gray-500 animate-fadeInLeft flex items-center justify-center gap-2 mx-auto"
              style={{ animationDelay: "400ms" }}
            >
              <span>🛠️</span>
              <span>Join Community (Coming Soon)</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Community Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 animate-fadeInLeft">
            Future Community Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Forums & Discussions",
                description: "Engage in conversations about real estate trends and blockchain innovations.",
              },
              {
                title: "Events & Webinars",
                description: "Join online and offline events on real estate and blockchain technology.",
              },
              {
                title: "Resource Library",
                description: "Access guides and videos on Nigerian real estate and blockchain.",
              },
              {
                title: "Member Directory",
                description: "Connect with verified agents, developers, and investors.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#2A1A3D]/70 rounded-lg p-6 shadow-md animate-popUp"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 animate-fadeInLeft">
            Why Join Our Community?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Trusted Connections",
                description: "Network with verified professionals using our on-chain reputation system.",
              },
              {
                title: "Transparent Insights",
                description: "Access fraud-free market data and trends powered by blockchain.",
              },
              {
                title: "Investment Opportunities",
                description: "Discover exclusive real estate deals and fractional ownership options.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#2A1A3D]/70 rounded-lg p-6 shadow-md animate-popUp"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}