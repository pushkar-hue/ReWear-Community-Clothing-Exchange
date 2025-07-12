'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Filter,
  Search,
  Plus,
  ArrowRight,
  Star,
  Leaf,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';

interface SwapSummary {
  _id: string;
  swapId: string;
  status: string;
  progressPercentage: number;
  otherParty: {
    username: string;
    profileImage?: string;
  };
  myItem: {
    title: string;
    images: string[];
    estimatedValue: number;
  };
  theirItem: {
    title: string;
    images: string[];
    estimatedValue: number;
  };
  lastActivity: string;
  environmentalImpact?: {
    carbonSaved: number;
  };
  pointsEarned?: number;
}

export default function SwapsOverview() {
  const [swaps, setSwaps] = useState<SwapSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSwaps = async () => {
      try {
        // Mock data for demonstration
        const mockSwaps: SwapSummary[] = [
          {
            _id: 'swap1',
            swapId: 'SW-1234567890-abc123',
            status: 'in_transit',
            progressPercentage: 70,
            otherParty: {
              username: 'GreenFashionista',
              profileImage: '/placeholder-avatar.jpg'
            },
            myItem: {
              title: 'Vintage Denim Jacket',
              images: ['/placeholder-jacket.jpg'],
              estimatedValue: 55
            },
            theirItem: {
              title: 'Organic Cotton Sweater',
              images: ['/placeholder-sweater.jpg'],
              estimatedValue: 45
            },
            lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            environmentalImpact: {
              carbonSaved: 8.0
            }
          },
          {
            _id: 'swap2',
            swapId: 'SW-0987654321-def456',
            status: 'completed',
            progressPercentage: 100,
            otherParty: {
              username: 'EcoStyler',
              profileImage: '/placeholder-avatar2.jpg'
            },
            myItem: {
              title: 'Designer Handbag',
              images: ['/placeholder-bag.jpg'],
              estimatedValue: 120
            },
            theirItem: {
              title: 'Silk Scarf Collection',
              images: ['/placeholder-scarf.jpg'],
              estimatedValue: 85
            },
            lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            environmentalImpact: {
              carbonSaved: 12.5
            },
            pointsEarned: 150
          },
          {
            _id: 'swap3',
            swapId: 'SW-1122334455-ghi789',
            status: 'pending',
            progressPercentage: 20,
            otherParty: {
              username: 'SustainableSarah',
              profileImage: '/placeholder-avatar3.jpg'
            },
            myItem: {
              title: 'Wool Winter Coat',
              images: ['/placeholder-coat.jpg'],
              estimatedValue: 200
            },
            theirItem: {
              title: 'Cashmere Cardigan',
              images: ['/placeholder-cardigan.jpg'],
              estimatedValue: 180
            },
            lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            environmentalImpact: {
              carbonSaved: 15.2
            }
          }
        ];

        setSwaps(mockSwaps);
        setLoading(false);
      } catch (error) {
        console.error('Error loading swaps:', error);
        setLoading(false);
      }
    };

    loadSwaps();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      accepted: 'text-green-600 bg-green-100 border-green-200',
      method_selected: 'text-blue-600 bg-blue-100 border-blue-200',
      items_prepared: 'text-purple-600 bg-purple-100 border-purple-200',
      in_transit: 'text-orange-600 bg-orange-100 border-orange-200',
      delivered: 'text-indigo-600 bg-indigo-100 border-indigo-200',
      confirmed: 'text-green-700 bg-green-200 border-green-300',
      completed: 'text-green-800 bg-green-300 border-green-400',
      disputed: 'text-red-600 bg-red-100 border-red-200',
      cancelled: 'text-gray-600 bg-gray-100 border-gray-200'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'disputed':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredSwaps = swaps.filter(swap => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && ['pending', 'accepted', 'method_selected', 'items_prepared', 'in_transit', 'delivered'].includes(swap.status)) ||
      (filter === 'completed' && swap.status === 'completed') ||
      (filter === 'pending' && swap.status === 'pending');
    
    const matchesSearch = searchTerm === '' || 
      swap.otherParty.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.myItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.theirItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.swapId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading your swaps...</h2>
          <p className="text-gray-500">Tracking your sustainable exchanges</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Swaps</h1>
                  <p className="text-sm text-gray-500">Track and manage your clothing exchanges</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{swaps.length}</p>
                <p className="text-sm text-gray-500">Total Swaps</p>
              </div>
              <Link 
                href="/browse"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Swap</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {swaps.filter(s => s.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {swaps.filter(s => ['in_transit', 'items_prepared', 'method_selected', 'accepted'].includes(s.status)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Leaf className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">CO2 Saved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {swaps.reduce((acc, s) => acc + (s.environmentalImpact?.carbonSaved || 0), 0).toFixed(1)}kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {swaps.reduce((acc, s) => acc + (s.pointsEarned || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-1">
              {(['all', 'active', 'completed', 'pending'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === filterOption
                      ? 'bg-green-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search swaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Swaps List */}
        {filteredSwaps.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No swaps found</h3>
            <p className="text-gray-500 mb-6">
              {swaps.length === 0 
                ? "You haven't started any swaps yet. Browse items to begin your sustainable journey!"
                : "No swaps match your current filters. Try adjusting your search criteria."
              }
            </p>
            <Link 
              href="/browse"
              className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Browse Items</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSwaps.map((swap) => (
              <div key={swap._id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(swap.status)}`}>
                      {getStatusIcon(swap.status)}
                      <span>{swap.status.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-gray-500">#{swap.swapId.slice(-8)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last activity</p>
                      <p className="text-sm font-medium text-gray-900">{formatLastActivity(swap.lastActivity)}</p>
                    </div>
                    <Link 
                      href={`/swaps/${swap.swapId}`}
                      className="text-green-600 hover:text-green-800"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* My Item */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 truncate">Your Item</h4>
                      <p className="text-sm text-gray-600 truncate">{swap.myItem.title}</p>
                      <p className="text-sm text-green-600">${swap.myItem.estimatedValue}</p>
                    </div>
                  </div>

                  {/* Exchange Arrow & Progress */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">{swap.otherParty.username}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full max-w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${swap.progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-1">{swap.progressPercentage}%</p>
                    </div>
                  </div>

                  {/* Their Item */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 truncate">Their Item</h4>
                      <p className="text-sm text-gray-600 truncate">{swap.theirItem.title}</p>
                      <p className="text-sm text-green-600">${swap.theirItem.estimatedValue}</p>
                    </div>
                  </div>
                </div>

                {/* Environmental Impact & Points */}
                {(swap.environmentalImpact || swap.pointsEarned) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      {swap.environmentalImpact && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Leaf className="w-4 h-4" />
                          <span>{swap.environmentalImpact.carbonSaved}kg CO2 saved</span>
                        </div>
                      )}
                      {swap.pointsEarned && (
                        <div className="flex items-center space-x-1 text-purple-600">
                          <Star className="w-4 h-4" />
                          <span>{swap.pointsEarned} points earned</span>
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      href={`/swaps/${swap.swapId}`}
                      className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
