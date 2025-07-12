'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MessageCircle, 
  ShoppingBag,
  Star,
  MapPin,
  Calendar,
  User,
  Shield,
  Recycle,
  Leaf
} from 'lucide-react';

interface ItemData {
  _id: string;
  itemId: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  owner: {
    username: string;
    ecoLevel: string;
    sustainabilityScore: number;
  };
  createdAt: string;
  pointsRequired: number;
  carbonSavings: number;
  isAvailable: boolean;
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.itemId as string;
  
  const [item, setItem] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/items/${itemId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Item not found');
          } else {
            setError('Failed to load item');
          }
          return;
        }

        const data = await response.json();
        setItem(data.data);
      } catch (err) {
        setError('Failed to load item');
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  const handleSwapRequest = () => {
    if (!item) return;
    // Navigate to swap creation page
    router.push(`/swaps/create?itemId=${item.itemId}`);
  };

  const handleMessage = () => {
    if (!item) return;
    // Navigate to messages with pre-filled recipient
    router.push(`/messages?user=${item.owner.username}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading item...</h2>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {error || 'Item not found'}
          </h2>
          <p className="text-gray-500 mb-4">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Browse Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <Image
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="capitalize">{item.category}</span>
                <span>•</span>
                <span>Size {item.size}</span>
                <span>•</span>
                <span>{item.condition}</span>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.owner.username}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.owner.ecoLevel === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                        item.owner.ecoLevel === 'Silver' ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {item.owner.ecoLevel}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        <span>{item.owner.sustainabilityScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Shield className="w-5 h-5 text-green-500" />
              </div>
            </div>

            {/* Sustainability Info */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center mb-2">
                <Leaf className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-900">Environmental Impact</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Carbon Saved:</span>
                  <span className="font-semibold ml-1">{item.carbonSavings}kg CO₂</span>
                </div>
                <div>
                  <span className="text-green-700">Points Required:</span>
                  <span className="font-semibold ml-1">{item.pointsRequired}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
              
              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {item.isAvailable ? (
                <>
                  <button
                    onClick={handleSwapRequest}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                  >
                    <Recycle className="w-5 h-5 mr-2" />
                    Request Swap
                  </button>
                  <button
                    onClick={handleMessage}
                    className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Message Owner
                  </button>
                </>
              ) : (
                <div className="w-full bg-gray-100 text-gray-500 py-3 px-6 rounded-xl font-semibold text-center">
                  No longer available
                </div>
              )}
            </div>

            {/* Item Info */}
            <div className="text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Available for swap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
