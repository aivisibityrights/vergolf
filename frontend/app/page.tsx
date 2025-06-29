// app/page.tsx - VerGolf Landing Page
import Link from 'next/link'
import { ArrowRight, Users, MapPin, Star, Calendar, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏌️</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                VerGolf
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-green-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-green-600 transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">
                Pricing
              </Link>
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Sign In with AIVerID
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Global Golf Community
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with golfers worldwide, book tee times, find caddies, and improve your game 
              with AI-powered insights. Join the revolution in golf technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105">
                Join Waitlist
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </button>
              
              <button className="w-full sm:w-auto border-2 border-green-200 text-green-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200">
                Watch Demo
              </button>
            </div>
            
            <div className="mt-12 text-sm text-gray-500">
              🔐 Secured by <strong>AIVerID</strong> • 🌍 <strong>Global Platform</strong> • ⚡ <strong>AI-Powered</strong>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Built for Every Golf Enthusiast
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you play, teach, caddie, or manage courses, VerGolf has something for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Golfers */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Golfers</h3>
              <p className="text-gray-600 mb-6">Find playing partners, book tee times, and track your progress</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  AI-powered player matching
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Real-time course booking
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Performance analytics
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Social connections
                </li>
              </ul>
            </div>

            {/* Golf Courses */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Golf Courses</h3>
              <p className="text-gray-600 mb-6">Maximize bookings and manage your facility efficiently</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Dynamic pricing
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Inventory management
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Customer analytics
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Revenue optimization
                </li>
              </ul>
            </div>

            {/* Caddies */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className="w-16 h-16 bg-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Caddies</h3>
              <p className="text-gray-600 mb-6">Connect with golfers and manage your caddie business</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Direct booking system
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Rating & reviews
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Flexible scheduling
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  No commission on tips
                </li>
              </ul>
            </div>

            {/* Golf Pros */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Golf Pros</h3>
              <p className="text-gray-600 mb-6">Teach more students, manage lessons, grow your business</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Student management
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Lesson scheduling
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Progress tracking
                </li>
                <li className="flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Payment processing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of golf with our innovative features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Smart Matching</h3>
              <p className="text-gray-600">
                Our AI analyzes playing styles, skill levels, and preferences to find 
                your perfect golf partners every time
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AIVerID Integration</h3>
              <p className="text-gray-600">
                Secure authentication with blockchain-verified identity. 
                One account for the entire golf ecosystem
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Network</h3>
              <p className="text-gray-600">
                Access golf courses, caddies, and pros worldwide. 
                Book anywhere, play everywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Golf Experience?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of golfers already using VerGolf to enhance their game
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="w-full sm:w-auto bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105">
              Join Waitlist Now
              <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>
            
            <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-200">
              Learn More
            </button>
          </div>
          
          <div className="mt-8 text-green-100">
            🚀 <strong>Coming Soon</strong> • Early Bird Benefits Available
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🏌️</span>
                </div>
                <span className="text-xl font-bold">VerGolf</span>
              </div>
              <p className="text-gray-400">
                The future of golf is here. Connect, play, and improve with AI.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VerGolf. Powered by AI Visibility Rights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}