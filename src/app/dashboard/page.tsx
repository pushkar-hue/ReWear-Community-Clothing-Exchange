'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  username: string;
  pointsBalance: number;
  sustainabilityScore: number;
  ecoLevel: string;
  totalSwaps: number;
  totalItemsListed: number;
  carbonSaved: number;
}

interface RecentActivity {
  id: string;
  type: 'swap' | 'list' | 'browse';
  title: string;
  description: string;
  timestamp: string;
  points?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
      return;
    }
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  // Mock recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'swap',
      title: 'Swapped vintage denim jacket',
      description: 'Successfully swapped with @sarah_styles',
      timestamp: '2 hours ago',
      points: 45
    },
    {
      id: '2',
      type: 'list',
      title: 'Listed designer boots',
      description: 'Prada leather boots - mint condition',
      timestamp: '1 day ago',
      points: 20
    },
    {
      id: '3',
      type: 'browse',
      title: 'Browsed summer dresses',
      description: 'Viewed 12 items in dresses category',
      timestamp: '2 days ago'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                ReWear
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-semibold">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Fashion Dashboard
          </h1>
          <p className="text-gray-600">
            Track your sustainable fashion impact and manage your wardrobe swaps
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points Balance</p>
                <p className="text-2xl font-bold text-blue-600">{user.pointsBalance}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">💎</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sustainability Score</p>
                <p className="text-2xl font-bold text-green-600">{user.sustainabilityScore}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">🌱</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                <p className="text-2xl font-bold text-purple-600">{user.totalSwaps}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">🔄</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CO₂ Saved</p>
                <p className="text-2xl font-bold text-green-600">{user.carbonSaved}kg</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">🌍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Eco Level Badge */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Your Eco Level: {user.ecoLevel}</h3>
              <p className="opacity-90">
                You've reached {user.ecoLevel} status! Keep up the sustainable choices.
              </p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'my-items', 'swaps', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                      href="/upload"
                      className="bg-blue-50 hover:bg-blue-100 rounded-lg p-4 text-center transition-colors"
                    >
                      <div className="text-2xl mb-2">📤</div>
                      <div className="font-medium text-blue-700">List Item</div>
                    </Link>
                    <Link
                      href="/browse"
                      className="bg-green-50 hover:bg-green-100 rounded-lg p-4 text-center transition-colors"
                    >
                      <div className="text-2xl mb-2">🔍</div>
                      <div className="font-medium text-green-700">Browse Items</div>
                    </Link>
                    <div className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 text-center transition-colors cursor-pointer">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="font-medium text-purple-700">AR Try-On</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Sustainability Impact</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Water saved this month</span>
                      <span className="font-bold text-blue-600">1,250L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Chemical reduction</span>
                      <span className="font-bold text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Items saved from landfill</span>
                      <span className="font-bold text-purple-600">{user.totalSwaps}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'my-items' && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">My Listed Items</h3>
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">👕</div>
                  <p>You have {user.totalItemsListed} items listed</p>
                  <Link
                    href="/upload"
                    className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    List New Item
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'swaps' && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Swap History</h3>
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🔄</div>
                  <p>You've completed {user.totalSwaps} successful swaps</p>
                  <Link
                    href="/browse"
                    className="inline-block mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Browse Items to Swap
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {activity.type === 'swap' && '🔄'}
                        {activity.type === 'list' && '📤'}
                        {activity.type === 'browse' && '🔍'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                      {activity.points && (
                        <div className="text-sm font-bold text-green-600">
                          +{activity.points} pts
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Goals</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Monthly Swaps</span>
                    <span>{user.totalSwaps % 10}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${((user.totalSwaps % 10) / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Eco Points</span>
                    <span>{user.pointsBalance}/500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(user.pointsBalance / 500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🥇</span>
                  <div>
                    <p className="font-medium">First Swap</p>
                    <p className="text-xs text-gray-500">Complete your first item exchange</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🌟</span>
                  <div>
                    <p className="font-medium">Eco Warrior</p>
                    <p className="text-xs text-gray-500">Save 10kg of CO₂</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 opacity-50">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="font-medium">Swap Master</p>
                    <p className="text-xs text-gray-500">Complete 25 swaps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
