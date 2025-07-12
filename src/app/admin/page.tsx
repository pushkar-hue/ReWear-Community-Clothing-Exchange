'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Settings, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  Flag,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Bell,
  Star,
  MessageSquare,
  Recycle,
  Leaf,
  Award,
  Target
} from 'lucide-react';

// Types for admin data
interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalItems: number;
  pendingItems: number;
  totalSwaps: number;
  completedSwaps: number;
  reportedContent: number;
  sustainabilityMetrics: {
    totalCO2Saved: number;
    itemsRescued: number;
    wasteReduced: number;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  status: 'active' | 'suspended' | 'pending';
  swapCount: number;
  reportCount: number;
  sustainabilityScore: number;
  ecoLevel: string;
}

interface Item {
  id: string;
  title: string;
  category: string;
  uploader: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
  reportCount: number;
  swapCount: number;
  images: string[];
}

interface Report {
  id: string;
  type: 'user' | 'item' | 'swap';
  targetId: string;
  targetTitle: string;
  reportedBy: string;
  reason: string;
  description: string;
  date: string;
  status: 'pending' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high';
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'items' | 'reports' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      
      // Mock data for demonstration
      const mockStats: AdminStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalItems: 3456,
        pendingItems: 23,
        totalSwaps: 876,
        completedSwaps: 743,
        reportedContent: 8,
        sustainabilityMetrics: {
          totalCO2Saved: 2847.5,
          itemsRescued: 1892,
          wasteReduced: 1234.7
        }
      };

      const mockUsers: User[] = [
        {
          id: 'user1',
          username: 'EcoWarrior2024',
          email: 'eco.warrior@email.com',
          joinDate: '2024-11-15',
          status: 'active',
          swapCount: 23,
          reportCount: 0,
          sustainabilityScore: 95,
          ecoLevel: 'Gold'
        },
        {
          id: 'user2',
          username: 'GreenFashionista',
          email: 'green.style@email.com',
          joinDate: '2024-12-01',
          status: 'active',
          swapCount: 18,
          reportCount: 0,
          sustainabilityScore: 87,
          ecoLevel: 'Silver'
        },
        {
          id: 'user3',
          username: 'SuspiciousUser',
          email: 'suspicious@email.com',
          joinDate: '2025-01-05',
          status: 'suspended',
          swapCount: 3,
          reportCount: 5,
          sustainabilityScore: 45,
          ecoLevel: 'Bronze'
        }
      ];

      const mockItems: Item[] = [
        {
          id: 'item1',
          title: 'Vintage Denim Jacket',
          category: 'Outerwear',
          uploader: 'EcoWarrior2024',
          uploadDate: '2025-01-10',
          status: 'approved',
          reportCount: 0,
          swapCount: 2,
          images: ['/placeholder-jacket.jpg']
        },
        {
          id: 'item2',
          title: 'Questionable Item',
          category: 'Accessories',
          uploader: 'SuspiciousUser',
          uploadDate: '2025-01-11',
          status: 'pending',
          reportCount: 2,
          swapCount: 0,
          images: ['/placeholder-item.jpg']
        }
      ];

      const mockReports: Report[] = [
        {
          id: 'report1',
          type: 'item',
          targetId: 'item2',
          targetTitle: 'Questionable Item',
          reportedBy: 'EcoWarrior2024',
          reason: 'inappropriate_content',
          description: 'Item appears to be counterfeit and in poor condition.',
          date: '2025-01-11',
          status: 'pending',
          severity: 'medium'
        },
        {
          id: 'report2',
          type: 'user',
          targetId: 'user3',
          targetTitle: 'SuspiciousUser',
          reportedBy: 'GreenFashionista',
          reason: 'spam',
          description: 'User is posting inappropriate messages and spam content.',
          date: '2025-01-10',
          status: 'pending',
          severity: 'high'
        }
      ];

      setStats(mockStats);
      setUsers(mockUsers);
      setItems(mockItems);
      setReports(mockReports);
      setLoading(false);
    };

    loadAdminData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-600 bg-green-100',
      approved: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      suspended: 'text-red-600 bg-red-100',
      rejected: 'text-red-600 bg-red-100',
      resolved: 'text-blue-600 bg-blue-100',
      dismissed: 'text-gray-600 bg-gray-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-red-600 bg-red-100'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'ban') => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: action === 'activate' ? 'active' : 'suspended' }
        : user
    ));
  };

  const handleItemAction = (itemId: string, action: 'approve' | 'reject') => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
        : item
    ));
  };

  const handleReportAction = (reportId: string, action: 'resolve' | 'dismiss') => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'resolve' ? 'resolved' : 'dismissed' }
        : report
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading admin panel...</h2>
          <p className="text-gray-500">Accessing platform management tools</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-sm text-gray-500">Platform management and moderation</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'items', label: 'Items', icon: Package },
            { id: 'reports', label: 'Reports', icon: Flag },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600">
                      {stats.activeUsers} active ({Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalItems.toLocaleString()}</p>
                    <p className="text-xs text-yellow-600">
                      {stats.pendingItems} pending review
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Recycle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps.toLocaleString()}</p>
                    <p className="text-xs text-green-600">
                      {Math.round((stats.completedSwaps / stats.totalSwaps) * 100)}% completion rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.reportedContent}</p>
                    <p className="text-xs text-red-600">Needs attention</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sustainability Metrics */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-green-500" />
                <span>Sustainability Impact</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.sustainabilityMetrics.totalCO2Saved.toLocaleString()}kg
                  </div>
                  <p className="text-sm text-gray-600">CO2 Emissions Saved</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.sustainabilityMetrics.itemsRescued.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Items Rescued from Waste</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats.sustainabilityMetrics.wasteReduced.toLocaleString()}kg
                  </div>
                  <p className="text-sm text-gray-600">Textile Waste Reduced</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
                <div className="space-y-3">
                  {reports.slice(0, 3).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{report.targetTitle}</p>
                        <p className="text-xs text-gray-600">{report.reason.replace('_', ' ')}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Items</h3>
                <div className="space-y-3">
                  {items.filter(item => item.status === 'pending').slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-600">by {item.uploader}</p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleItemAction(item.id, 'approve')}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleItemAction(item.id, 'reject')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Swaps</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eco Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.swapCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-900">{user.sustainabilityScore}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              user.ecoLevel === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                              user.ecoLevel === 'Silver' ? 'bg-gray-100 text-gray-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {user.ecoLevel}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${user.reportCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                            {user.reportCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user.id, 'activate')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            {/* Items Management Interface */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Moderation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">by {item.uploader}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-gray-500">{item.category}</span>
                      </div>
                      {item.status === 'pending' && (
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => handleItemAction(item.id, 'approve')}
                            className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-xs hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleItemAction(item.id, 'reject')}
                            className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-xs hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{report.targetTitle}</div>
                          <div className="text-sm text-gray-500">Reported by {report.reportedBy}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.reason.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(report.severity)}`}>
                            {report.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {report.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleReportAction(report.id, 'resolve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => handleReportAction(report.id, 'dismiss')}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Growth Chart Placeholder</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sustainability Impact</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Impact Chart Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
