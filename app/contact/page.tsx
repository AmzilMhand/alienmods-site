import type { Metadata } from "next"
import { Mail, MessageCircle, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - AlienMods",
  description: "Get in touch with AlienMods support team. We are here to help you.",
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Have questions? We're here to help you get the most out of AlienMods.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Get help with downloads and technical issues</p>
          <a href="mailto:support@alienmods.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            support@alienmods.com
          </a>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Chat with our support team in real-time</p>
          <button className="text-blue-600 dark:text-blue-400 hover:underline">Start Chat</button>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">We typically respond within 24 hours</p>
          <span className="text-blue-600 dark:text-blue-400">24/7 Support</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input type="text" className="search-input" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input type="email" className="search-input" placeholder="your@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
            <input type="text" className="search-input" placeholder="How can we help?" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
            <textarea
              rows={6}
              className="search-input resize-none"
              placeholder="Tell us more about your question or issue..."
            />
          </div>

          <button type="submit" className="download-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
