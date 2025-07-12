'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  User, 
  LogOut, 
  Settings, 
  Award, 
  ShoppingBag,
  Bell,
  ChevronDown,
  Menu,
  X,
  Crown,
  Star,
  Recycle
} from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  pointsBalance: number;
  sustainabilityScore: number;
  ecoLevel: string;
  totalSwaps: number;
  carbonSaved: number;
}

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileDropdownOpen(false);
    router.push('/login');
  };

  const getEcoLevelColor = (level: string) => {
    switch (level) {
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Silver': return 'text-gray-600 bg-gray-100';
      case 'Bronze': return 'text-orange-600 bg-orange-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Browse', href: '/browse' },
    { name: 'Upload', href: '/upload' },
    { name: 'My Swaps', href: '/swaps' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Admin', href: '/admin' }, // Add admin link for all users (can be made conditional later)
  ];

  // Don't show navbar on auth pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                ReWear
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                {/* Points Display */}
                <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.pointsBalance?.toLocaleString() || 0}
                  </span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${getEcoLevelColor(user.ecoLevel || 'Bronze')}`}>
                        {user.ecoLevel || 'Bronze'}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getEcoLevelColor(user.ecoLevel || 'Bronze')}`}>
                              <Crown className="w-3 h-3 mr-1" />
                              {user.ecoLevel || 'Bronze'} Level
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-600">{user.pointsBalance?.toLocaleString() || 0}</div>
                            <div className="text-xs text-gray-500">Points</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">{user.totalSwaps || 0}</div>
                            <div className="text-xs text-gray-500">Swaps</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-600">{user.sustainabilityScore || 0}</div>
                            <div className="text-xs text-gray-500">Eco Score</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">{user.carbonSaved || 0}kg</div>
                            <div className="text-xs text-gray-500">CO₂ Saved</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Award className="w-4 h-4 mr-3" />
                          My Dashboard
                        </Link>
                        <Link
                          href="/my-items"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <ShoppingBag className="w-4 h-4 mr-3" />
                          My Items
                        </Link>
                        <Link
                          href="/swaps"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Recycle className="w-4 h-4 mr-3" />
                          My Swaps
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile user info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.pointsBalance?.toLocaleString() || 0} points</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
}
