import { Send } from 'lucide-react';

export default function ContactForm() {
  return (
    <div>
      
      <div className="p-4 rounded-lg"
      
      style={{
        backgroundImage: 'linear-gradient(to bottom, #0D0A0F,rgb(44, 44, 42))), url("/property-image/contact-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}   
      
      
      >
        <h2 className="text-xl font-bold mb-3">Contact Agent</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-[#0D0A0F] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-[#0D0A0F] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-gray-400 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full bg-[#0D0A0F] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm text-gray-400 mb-1">
              Your Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full bg-[#0D0A0F] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <span>Send Message</span>
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}