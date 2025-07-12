import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                ReWear
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/browse" className="text-gray-600 hover:text-green-600 transition-colors">
                Browse Items
              </Link>
              <Link href="/leaderboard" className="text-gray-600 hover:text-green-600 transition-colors">
                Eco-Leaderboard
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-green-600 transition-colors">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Fashion that
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent block">
              Gives Back
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your closet into a sustainable fashion playground. Swap clothes, discover your style with AI, 
            and make a positive impact on the planet - one outfit at a time.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/register"
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Swapping
            </Link>
            <Link 
              href="/browse"
              className="border-2 border-green-500 text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-all duration-200"
            >
              Browse Items
            </Link>
            <Link 
              href="/upload"
              className="border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200"
            >
              List an Item
            </Link>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Style Assistant</h3>
              <p className="text-gray-600">
                Get personalized outfit recommendations and style advice powered by advanced AI technology.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AR Try-On Experience</h3>
              <p className="text-gray-600">
                See how clothes look styled on you before swapping with our AR-powered visualization.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability Impact</h3>
              <p className="text-gray-600">
                Track your environmental impact and compete on the eco-leaderboard to save the planet.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Platform Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2.5K+</div>
                <div className="text-gray-600">Items Swapped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">850+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">1.2T</div>
                <div className="text-gray-600">CO₂ Saved (kg)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="text-xl font-bold">ReWear</span>
          </div>
          <p className="text-gray-400">
            Building a sustainable future, one swap at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
           