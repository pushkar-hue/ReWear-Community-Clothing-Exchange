'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  images: string[];
  arStyledImage?: string;
  pointsValue: number;
  views: number;
  likes: number;
  estimatedCarbonSaving: number;
  userId: {
    username: string;
    ecoLevel: string;
  };
  createdAt: string;
}

interface Filters {
  category: string;
  size: string;
  condition: string;
  search: string;
  sort: string;
  order: string;
}

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'activewear', label: 'Activewear' },
  { value: 'formal', label: 'Formal' },
];

const SIZES = [
  { value: '', label: 'All Sizes' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: 'One Size', label: 'One Size' },
];

const CONDITIONS = [
  { value: '', label: 'All Conditions' },
  { value: 'New', label: 'New' },
  { value: 'Like New', label: 'Like New' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'pointsValue', label: 'Points: High to Low' },
  { value: 'pointsValue_asc', label: 'Points: Low to High' },
  { value: 'views', label: 'Most Popular' },
  { value: 'estimatedCarbonSaving', label: 'Eco Impact' },
];

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showARView, setShowARView] = useState<{ [key: string]: boolean }>({});
  
  const [filters, setFilters] = useState<Filters>({
    category: '',
    size: '',
    condition: '',
    search: '',
    sort: 'createdAt',
    order: 'desc',
  });

  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  // Memoized query string for performance
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'sort' && value.includes('_asc')) {
          params.append('sort', value.replace('_asc', ''));
          params.append('order', 'asc');
        } else {
          params.append(key, value);
        }
      }
    });
    params.append('limit', pagination.limit.toString());
    params.append('offset', pagination.offset.toString());
    return params.toString();
  }, [filters, pagination.limit, pagination.offset]);

  // Optimized fetch function with error handling
  const fetchItems = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching items from:', `/api/items?${queryString}`);
      const response = await fetch(`/api/items?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        const newItems = data.items || [];
        setItems(reset ? newItems : [...items, ...newItems]);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          hasMore: data.pagination?.hasMore || false,
        }));
        
        // Log if no items found
        if (newItems.length === 0 && reset) {
          console.log('No items found in database');
        }
      } else {
        throw new Error(data.error || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [queryString, items]);

  // Initial load and filter changes
  useEffect(() => {
    fetchItems(true);
  }, [filters]); // Don't include fetchItems in deps to avoid infinite loop

  // Handle filter changes with debouncing for search
  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, offset: 0 }));
  }, []);

  // Load more items (pagination)
  const loadMore = useCallback(() => {
    if (!loading && pagination.hasMore) {
      setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
      fetchItems(false);
    }
  }, [loading, pagination.hasMore, fetchItems]);

  // Toggle AR view for specific items
  const toggleARView = useCallback((itemId: string) => {
    setShowARView(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  }, []);

  // Mock data for demo purposes (fallback if API fails)
  useEffect(() => {
    const mockItems: Item[] = [
      {
        _id: '1',
        title: 'Vintage Denim Jacket',
        description: 'Classic vintage denim jacket in excellent condition. Perfect for layering and sustainable fashion.',
        category: 'outerwear',
        size: 'M',
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop'],
        arStyledImage: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop',
        pointsValue: 85,
        views: 24,
        likes: 8,
        estimatedCarbonSaving: 4.2,
        userId: { username: 'fashion_lover', ecoLevel: 'Gold' },
        createdAt: '2025-01-10T10:00:00Z',
      },
      {
        _id: '2',
        title: 'Sustainable Cotton T-Shirt',
        description: 'Organic cotton t-shirt from sustainable brand. Soft, comfortable, and eco-friendly.',
        category: 'tops',
        size: 'S',
        condition: 'Like New',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'],
        arStyledImage: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&h=300&fit=crop',
        pointsValue: 45,
        views: 18,
        likes: 12,
        estimatedCarbonSaving: 2.1,
        userId: { username: 'eco_warrior', ecoLevel: 'Platinum' },
        createdAt: '2025-01-09T15:30:00Z',
      },
      {
        _id: '3',
        title: 'Designer Summer Dress',
        description: 'Beautiful floral summer dress from premium designer. Perfect for special occasions.',
        category: 'dresses',
        size: 'L',
        condition: 'New',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop'],
        arStyledImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop',
        pointsValue: 120,
        views: 31,
        likes: 15,
        estimatedCarbonSaving: 3.8,
        userId: { username: 'style_guru', ecoLevel: 'Silver' },
        createdAt: '2025-01-08T09:15:00Z',
      },
    ];

    // Try API first, fallback to mock data
    const loadItems = async () => {
      try {
        // First try the API
        const response = await fetch(`/api/items?${queryString}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setItems(data.items);
            setPagination(prev => ({
              ...prev,
              total: data.pagination.total,
              hasMore: data.pagination.hasMore,
            }));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.log('API not available, using mock data');
      }

      // Fallback to mock data
      setTimeout(() => {
        setItems(mockItems);
        setPagination(prev => ({ ...prev, total: mockItems.length, hasMore: false }));
        setLoading(false);
      }, 500);
    };

    loadItems();
  }, [queryString]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-green-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Browse Items
              </h1>
              <p className="text-gray-600">
                Discover amazing clothing with AI-powered styling insights
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <Link
                href="/upload"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                List Your Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SIZES.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CONDITIONS.map(condition => (
                  <option key={condition.value} value={condition.value}>{condition.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="text-red-400 text-xl">⚠️</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Items</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${items.length} of ${pagination.total} items`}
          </p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowARView({})}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Reset AR Views
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Image Container with AR Toggle */}
              <div className="relative aspect-square">
                <Image
                  src={showARView[item._id] && item.arStyledImage ? item.arStyledImage : item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                
                {/* AR Toggle Button */}
                {item.arStyledImage && (
                  <button
                    onClick={() => toggleARView(item._id)}
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                      showARView[item._id]
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/90 text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    {showARView[item._id] ? '✨ AR View' : '👁️ AR Style'}
                  </button>
                )}

                {/* Eco Level Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                    item.userId.ecoLevel === 'Platinum' ? 'bg-purple-500' :
                    item.userId.ecoLevel === 'Gold' ? 'bg-yellow-500' :
                    item.userId.ecoLevel === 'Silver' ? 'bg-gray-400' :
                    'bg-orange-500'
                  }`}>
                    {item.userId.ecoLevel}
                  </span>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <span className="text-lg font-bold text-blue-600 ml-2">
                    {item.pointsValue}pts
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span className="capitalize">{item.condition}</span>
                  <span>Size {item.size}</span>
                  <span>{item.estimatedCarbonSaving}kg CO₂</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>👀 {item.views}</span>
                    <span>❤️ {item.likes}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition-colors">
                      Swap
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors">
                      View
                    </button>
                  </div>
                </div>

                {/* User Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    by <span className="font-medium">{item.userId.username}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && items.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing items...</p>
          </div>
        )}

        {/* Load More Button */}
        {pagination.hasMore && !loading && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Load More Items
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Items Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            <Link
              href="/upload"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Be the first to list an item!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
