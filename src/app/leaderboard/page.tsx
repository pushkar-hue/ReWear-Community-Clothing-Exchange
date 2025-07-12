'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Leaf, 
  Recycle, 
  Zap,
  Target,
  Filter,
  Search,
  Calendar,
  Award,
  Star,
  Users,
  Globe,
  ArrowUp,
  ArrowDown,
  Timer,
  CheckCircle,
  Flame
} from 'lucide-react';

// Types for leaderboard data
interface LeaderboardEntry {
  _id: string;
  userId: string;
  username: string;
  totalCarbonSaved: number;
  totalSwaps: number;
  sustainabilityScore: number;
  ecoLevel: string;
  rank: number;
  trend: 'rising' | 'stable' | 'new';
  badges: string[];
  avgCarbonPerSwap: number;
  memberSince: string;
  user: {
    username: string;
    email: string;
    createdAt: string;
  };
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'seasonal' | 'special';
  target: number;
  unit: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  endDate: string;
  participantCount: number;
}

interface LeaderboardStats {
  totalParticipants: number;
  totalCarbonSaved: number;
  totalSwaps: number;
  avgSustainabilityScore: number;
  topEcoLevel: string;
}

// Eco level styling configuration
const ECO_LEVEL_STYLES = {
  Bronze: { color: 'text-amber-600', bg: 'bg-amber-50', icon: '🥉' },
  Silver: { color: 'text-gray-600', bg: 'bg-gray-50', icon: '🥈' },
  Gold: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '🥇' },
  Platinum: { color: 'text-purple-600', bg: 'bg-purple-50', icon: '💜' },
  Diamond: { color: 'text-blue-600', bg: 'bg-blue-50', icon: '💎' },
  Master: { color: 'text-green-600', bg: 'bg-green-50', icon: '👑' },
};

const DIFFICULTY_STYLES = {
  easy: { color: 'text-green-600', bg: 'bg-green-100' },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-100' },
  hard: { color: 'text-orange-600', bg: 'bg-orange-100' },
  expert: { color: 'text-red-600', bg: 'bg-red-100' },
};

export default function EcoLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'stats'>('leaderboard');
  
  // Filters
  const [period, setPeriod] = useState<'overall' | 'weekly' | 'monthly'>('overall');
  const [category, setCategory] = useState<'all' | 'carbon' | 'swaps' | 'score'>('all');
  const [ecoLevel, setEcoLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load leaderboard data
  const loadLeaderboardData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        period,
        category,
        limit: '50',
        ...(ecoLevel !== 'all' && { ecoLevel }),
      });

      const response = await fetch(`/api/leaderboard?${params}`);
      const data = await response.json();

      if (data.success) {
        setLeaderboard(data.data.leaderboard);
        setChallenges(data.data.activeChallenges);
        setStats(data.data.statistics);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [period, category, ecoLevel]);

  useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  // Filter leaderboard by search query
  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery) return leaderboard;
    
    return leaderboard.filter(entry =>
      entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.badges.some(badge => badge.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [leaderboard, searchQuery]);

  // Calculate time remaining for challenges
  const getTimeRemaining = useCallback((endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  }, []);

  // Render trend indicator
  const renderTrendIndicator = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'falling':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  // Render rank badge
  const renderRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Eco-Leaderboard...</h2>
          <p className="text-gray-500">Calculating global impact rankings</p>
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
                <Trophy className="w-8 h-8 text-green-600" />
                <h1 className="text-3xl font-bold text-gray-900">Eco-Leaderboard</h1>
              </div>
              <div className="text-sm text-gray-500">
                Track your environmental impact and compete to save the planet! 🌍
              </div>
            </div>
            
            {stats && (
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{stats.totalParticipants}</p>
                  <p className="text-gray-500">Eco-Warriors</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">{stats.totalCarbonSaved.toFixed(1)}kg</p>
                  <p className="text-gray-500">CO2 Saved</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-600">{stats.totalSwaps}</p>
                  <p className="text-gray-500">Total Swaps</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          {[
            { id: 'leaderboard', label: 'Rankings', icon: Trophy },
            { id: 'challenges', label: 'Eco-Challenges', icon: Target },
            { id: 'stats', label: 'Global Impact', icon: Globe },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === id
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="overall">All Time</option>
                    <option value="monthly">This Month</option>
                    <option value="weekly">This Week</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="carbon">Carbon Saved</option>
                    <option value="swaps">Total Swaps</option>
                    <option value="score">Sustainability Score</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  <select
                    value={ecoLevel}
                    onChange={(e) => setEcoLevel(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="Master">Master</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                  </select>
                </div>

                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search eco-warriors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {period === 'overall' ? 'All-Time' : period === 'weekly' ? 'Weekly' : 'Monthly'} Champions
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredLeaderboard.length} eco-warriors making a difference
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredLeaderboard.map((entry, index) => (
                  <div
                    key={entry._id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-12 h-12">
                          {renderRankBadge(entry.rank)}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">{entry.username}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${ECO_LEVEL_STYLES[entry.ecoLevel as keyof typeof ECO_LEVEL_STYLES].bg} ${ECO_LEVEL_STYLES[entry.ecoLevel as keyof typeof ECO_LEVEL_STYLES].color}`}>
                              {ECO_LEVEL_STYLES[entry.ecoLevel as keyof typeof ECO_LEVEL_STYLES].icon} {entry.ecoLevel}
                            </div>
                            {renderTrendIndicator(entry.trend)}
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Leaf className="w-4 h-4" />
                              <span>{entry.sustainabilityScore} pts</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Globe className="w-4 h-4" />
                              <span>{entry.totalCarbonSaved.toFixed(1)}kg CO2</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Recycle className="w-4 h-4" />
                              <span>{entry.totalSwaps} swaps</span>
                            </span>
                            <span className="text-gray-400">
                              Member since {new Date(entry.memberSince).getFullYear()}
                            </span>
                          </div>

                          {/* Badges */}
                          {entry.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {entry.badges.slice(0, 3).map((badge, badgeIndex) => (
                                <span
                                  key={badgeIndex}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                  {badge}
                                </span>
                              ))}
                              {entry.badges.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{entry.badges.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {category === 'carbon' ? `${entry.totalCarbonSaved.toFixed(1)}kg` :
                           category === 'swaps' ? entry.totalSwaps :
                           entry.sustainabilityScore}
                        </div>
                        <div className="text-sm text-gray-500">
                          Avg: {entry.avgCarbonPerSwap.toFixed(1)}kg per swap
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{challenge.icon}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_STYLES[challenge.difficulty].bg} ${DIFFICULTY_STYLES[challenge.difficulty].color}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {challenge.type}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Target:</span>
                    <span className="font-medium">{challenge.target} {challenge.unit}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Participants:</span>
                    <span className="font-medium">{challenge.participantCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Time Left:</span>
                    <span className="font-medium text-orange-600 flex items-center space-x-1">
                      <Timer className="w-4 h-4" />
                      <span>{getTimeRemaining(challenge.endDate)}</span>
                    </span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                  Join Challenge
                </button>
              </div>
            ))}

            {/* Create Challenge Card */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-green-300 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Suggest a Challenge</h3>
              <p className="text-sm text-gray-600 mb-4">Have an idea for a new eco-challenge?</p>
              <button className="bg-white text-green-600 border border-green-300 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors">
                Submit Idea
              </button>
            </div>
          </div>
        )}

        {/* Global Impact Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 bg-white rounded-xl p-8 shadow-sm text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🌍 Global Environmental Impact</h2>
              <p className="text-lg text-gray-600">
                Together, our ReWear community has made a significant impact on our planet's health!
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <div className="text-3xl font-bold text-green-800">{stats.totalCarbonSaved.toFixed(1)}kg</div>
              <div className="text-green-600 font-medium">Total CO2 Saved</div>
              <div className="text-sm text-green-500 mt-2">
                Equivalent to {Math.floor(stats.totalCarbonSaved / 0.4)} trees planted!
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🔄</div>
              <div className="text-3xl font-bold text-blue-800">{stats.totalSwaps}</div>
              <div className="text-blue-600 font-medium">Successful Swaps</div>
              <div className="text-sm text-blue-500 mt-2">
                Preventing {stats.totalSwaps * 2} new clothing purchases
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">👥</div>
              <div className="text-3xl font-bold text-purple-800">{stats.totalParticipants}</div>
              <div className="text-purple-600 font-medium">Active Eco-Warriors</div>
              <div className="text-sm text-purple-500 mt-2">
                Growing community of changemakers
              </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Impact Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{(stats.totalCarbonSaved * 3.67).toFixed(0)}L</div>
                  <div className="text-sm text-gray-600">Water Saved</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{(stats.totalSwaps * 0.5).toFixed(1)}kg</div>
                  <div className="text-sm text-gray-600">Waste Reduced</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{stats.avgSustainabilityScore.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Avg Sustainability Score</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
