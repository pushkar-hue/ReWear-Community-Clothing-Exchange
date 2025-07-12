'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Edit, 
  Save, 
  Camera,
  Award,
  Recycle,
  Leaf,
  Star,
  Crown,
  Calendar,
  Mail,
  Shield
} from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  pointsBalance: number;
  sustainabilityScore: number;
  ecoLevel: string;
  totalSwaps: number;
  totalItemsListed: number;
  carbonSaved: number;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          router.push('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setEditForm({ username: parsedUser.username, email: parsedUser.email });
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSaveProfile = async () => {
    try {
      // Here you would make an API call to update the user profile
      // For now, just update localStorage
      if (user) {
        const updatedUser = { ...user, ...editForm };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getEcoLevelInfo = (level: string) => {
    switch (level) {
      case 'Gold':
        return { color: 'text-yellow-600 bg-yellow-100', icon: Crown, description: 'Eco Champion' };
      case 'Silver':
        return { color: 'text-gray-600 bg-gray-100', icon: Award, description: 'Eco Advocate' };
      case 'Bronze':
        return { color: 'text-orange-600 bg-orange-100', icon: Star, description: 'Eco Explorer' };
      default:
        return { color: 'text-green-600 bg-green-100', icon: Leaf, description: 'Eco Beginner' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const ecoInfo = getEcoLevelInfo(user.ecoLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-32"></div>
          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-8">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="pt-20 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editing ? (
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-full ${ecoInfo.color} font-medium`}>
                        <ecoInfo.icon className="w-5 h-5 mr-2" />
                        {user.ecoLevel} Level - {ecoInfo.description}
                      </div>
                    </>
                  )}
                </div>

                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Points Balance</p>
                <p className="text-3xl font-bold text-green-600">{user.pointsBalance?.toLocaleString() || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Swaps</p>
                <p className="text-3xl font-bold text-blue-600">{user.totalSwaps || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Items Listed</p>
                <p className="text-3xl font-bold text-purple-600">{user.totalItemsListed || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">CO₂ Saved</p>
                <p className="text-3xl font-bold text-green-600">{user.carbonSaved || 0}kg</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Score */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sustainability Score</h2>
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(user.sustainabilityScore || 0) * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600">{user.sustainabilityScore || 0}</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Great Progress!</h3>
              <p className="text-gray-600 mb-4">
                Your sustainability score reflects your positive impact on the environment through clothing exchanges.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Next Level</span>
                  <span className="font-medium text-gray-900">
                    {user.ecoLevel === 'Bronze' ? 'Silver (80 points)' : 
                     user.ecoLevel === 'Silver' ? 'Gold (150 points)' : 
                     'Champion (200 points)'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(((user.sustainabilityScore || 0) % 100), 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-green-600" />
            Account Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-500">Last updated 30 days ago</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Change Password
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
