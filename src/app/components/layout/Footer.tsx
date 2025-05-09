"use client";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#16091D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Description Section */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <Image
                src="/strataforge-logo.png"
                alt="StrataForge Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm mb-8">
              StrataForge is a no-code token deployment platform that empowers creators, businesses, and communities
              to launch tokens without requiring blockchain development expertise. All transactions involve risk and
              possible loss of funds. Past results dont guarantee future outcomes.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <Link
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Instagram size={20} className="text-white" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Twitter size={20} className="text-white" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Github size={20} className="text-white" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <h3 className="text-white text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/listings"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Listings
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-white text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Email Subscription */}
          <div className="md:col-span-4">
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your e-mail address..."
                className="w-full rounded-full bg-gray-800/50 border border-gray-700 py-3 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <br />
              <div className="flex justify-end">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 text-center md:text-left">
          <p className="text-gray-400 text-sm">StrataForge © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}