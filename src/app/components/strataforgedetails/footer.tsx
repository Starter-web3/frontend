import Link from "next/link"
import { Facebook, Twitter, Instagram, Search } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs font-bold">P</span>
              </div>
              <span className="font-bold">PropChain</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              The most trusted real estate marketplace for buying, selling, and renting properties on the blockchain.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="bg-[#252525] p-2 rounded-full hover:bg-[#303030] transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="bg-[#252525] p-2 rounded-full hover:bg-[#303030] transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="bg-[#252525] p-2 rounded-full hover:bg-[#303030] transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Find what you need..."
                className="w-full bg-[#252525] border border-gray-700 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © 2023 PropChain. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
