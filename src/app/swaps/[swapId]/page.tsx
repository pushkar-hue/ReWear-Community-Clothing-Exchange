'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Camera,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Copy,
  Calendar,
  User,
  Recycle,
  Leaf,
  Award,
  Info,
  Upload,
  Phone,
  Mail
} from 'lucide-react';

// Types for swap management
interface SwapDetails {
  _id: string;
  swapId: string;
  status: string;
  progressPercentage: number;
  requester: {
    userId: string;
    username: string;
    item: {
      itemId: string;
      title: string;
      images: string[];
      estimatedValue: number;
      carbonSaving: number;
    }
  };
  provider: {
    userId: string;
    username: string;
    item: {
      itemId: string;
      title: string;
      images: string[];
      estimatedValue: number;
      carbonSaving: number;
    }
  };
  exchangeMethod?: {
    type: 'in_person' | 'postal' | 'drop_off_point' | 'escrow_service';
    details: any;
  };
  verification: {
    requesterConfirmations: any;
    providerConfirmations: any;
    photos: any;
  };
  timeline: Array<{
    event: string;
    timestamp: string;
    performedBy: string;
    details: string;
  }>;
  environmentalImpact?: {
    totalCarbonSaved: number;
    waterSaved: number;
    wasteReduced: number;
  };
  pointsCalculation?: {
    totalPoints: {
      requester: number;
      provider: number;
    };
  };
}

interface SwapPageProps {
  params: Promise<{ swapId: string }>;
}

// Main page component
export default function SwapPage({ params }: SwapPageProps) {
  const { swapId } = use(params);
  return <SwapManagement swapId={swapId} />;
}

// SwapManagement component
function SwapManagement({ swapId }: { swapId: string }) {
  const [swap, setSwap] = useState<SwapDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState({ id: 'current-user', username: 'EcoWarrior' });
  const [activeTab, setActiveTab] = useState<'overview' | 'logistics' | 'verification' | 'timeline'>('overview');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Load swap details
  useEffect(() => {
    const loadSwapDetails = async () => {
      try {
        // Mock data for demonstration - replace with actual API call
        const mockSwap: SwapDetails = {
          _id: 'swap123',
          swapId: 'SW-1234567890-abc123',
          status: 'in_transit',
          progressPercentage: 70,
          requester: {
            userId: 'current-user',
            username: 'EcoWarrior',
            item: {
              itemId: 'item1',
              title: 'Vintage Denim Jacket',
              images: ['/placeholder-jacket.jpg'],
              estimatedValue: 55,
              carbonSaving: 4.2
            }
          },
          provider: {
            userId: 'user-2',
            username: 'GreenFashionista',
            item: {
              itemId: 'item2',
              title: 'Organic Cotton Sweater',
              images: ['/placeholder-sweater.jpg'],
              estimatedValue: 45,
              carbonSaving: 3.8
            }
          },
          exchangeMethod: {
            type: 'postal',
            details: {
              shippingDetails: {
                trackingNumbers: {
                  requesterToProvider: 'USPS123456789',
                  providerToRequester: 'USPS987654321'
                },
                shippingService: 'usps',
                estimatedDelivery: {
                  requesterItem: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                  providerItem: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                }
              }
            }
          },
          verification: {
            requesterConfirmations: {
              itemPrepared: { confirmed: true, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
              itemSent: { confirmed: true, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), proof: 'USPS123456789' },
              itemReceived: { confirmed: false }
            },
            providerConfirmations: {
              itemPrepared: { confirmed: true, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
              itemSent: { confirmed: true, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), proof: 'USPS987654321' },
              itemReceived: { confirmed: false }
            },
            photos: {
              beforeShipping: {
                requesterItem: ['/placeholder-before1.jpg'],
                providerItem: ['/placeholder-before2.jpg']
              },
              afterReceiving: {
                requesterItem: [],
                providerItem: []
              }
            }
          },
          timeline: [
            {
              event: 'Swap request created',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              performedBy: 'current-user',
              details: 'Initial swap request sent'
            },
            {
              event: 'Status changed to accepted',
              timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              performedBy: 'user-2',
              details: 'Swap request accepted'
            },
            {
              event: 'Exchange method selected: postal',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              performedBy: 'current-user',
              details: 'Postal exchange method selected'
            },
            {
              event: 'Status changed to items_prepared',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              performedBy: 'user-2',
              details: 'Both items prepared for shipping'
            },
            {
              event: 'Status changed to in_transit',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              performedBy: 'system',
              details: 'Both items shipped and in transit'
            }
          ]
        };

        setSwap(mockSwap);
        setLoading(false);
      } catch (error) {
        console.error('Error loading swap details:', error);
        setLoading(false);
      }
    };

    loadSwapDetails();
  }, [swapId]);

  const handleConfirmReceived = useCallback(async (condition: string, rating: number) => {
    if (!swap) return;

    try {
      // API call to confirm receipt
      console.log('Confirming receipt:', { condition, rating });
      
      // Update local state
      setSwap(prev => {
        if (!prev) return prev;
        
        const isRequester = prev.requester.userId === currentUser.id;
        const confirmationPath = isRequester ? 'requesterConfirmations' : 'providerConfirmations';
        
        return {
          ...prev,
          verification: {
            ...prev.verification,
            [confirmationPath]: {
              ...prev.verification[confirmationPath],
              itemReceived: {
                confirmed: true,
                timestamp: new Date(),
                condition
              },
              satisfactionRating: rating
            }
          }
        };
      });
    } catch (error) {
      console.error('Error confirming receipt:', error);
    }
  }, [swap, currentUser.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      accepted: 'text-green-600 bg-green-100',
      method_selected: 'text-blue-600 bg-blue-100',
      items_prepared: 'text-purple-600 bg-purple-100',
      in_transit: 'text-orange-600 bg-orange-100',
      delivered: 'text-indigo-600 bg-indigo-100',
      confirmed: 'text-green-700 bg-green-200',
      completed: 'text-green-800 bg-green-300',
      disputed: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading swap details...</h2>
          <p className="text-gray-500">Tracking your sustainable exchange</p>
        </div>
      </div>
    );
  }

  if (!swap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Swap not found</h2>
          <p className="text-gray-500">The requested swap could not be found.</p>
        </div>
      </div>
    );
  }

  const isRequester = swap.requester.userId === currentUser.id;
  const otherParty = isRequester ? swap.provider : swap.requester;
  const myItem = isRequester ? swap.requester.item : swap.provider.item;
  const theirItem = isRequester ? swap.provider.item : swap.requester.item;

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
                  <h1 className="text-2xl font-bold text-gray-900">Swap Management</h1>
                  <p className="text-sm text-gray-500">ID: {swap.swapId}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(swap.status)}`}>
                {swap.status.replace('_', ' ').toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="font-medium text-gray-900">{swap.progressPercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Exchange Progress</h2>
            <span className="text-sm text-gray-500">{swap.progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${swap.progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Request Sent</span>
            <span>Method Selected</span>
            <span>Items Prepared</span>
            <span>In Transit</span>
            <span>Delivered</span>
            <span>Completed</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'logistics', label: 'Logistics', icon: Truck },
            { id: 'verification', label: 'Verification', icon: CheckCircle },
            { id: 'timeline', label: 'Timeline', icon: Clock },
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Swap Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Swap Details</h3>
              
              <div className="space-y-6">
                {/* My Item */}
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Your Item</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{myItem.title}</h4>
                      <p className="text-sm text-gray-600">Value: ${myItem.estimatedValue}</p>
                      <p className="text-sm text-green-600">🌱 {myItem.carbonSaving}kg CO2 saved</p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="bg-gray-100 rounded-full p-3">
                    <ArrowRight className="w-6 h-6 text-gray-600" />
                  </div>
                </div>

                {/* Their Item */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">{otherParty.username}'s Item</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{theirItem.title}</h4>
                      <p className="text-sm text-gray-600">Value: ${theirItem.estimatedValue}</p>
                      <p className="text-sm text-green-600">🌱 {theirItem.carbonSaving}kg CO2 saved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact</h3>
              
              {swap.environmentalImpact ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🌍</div>
                    <div className="text-2xl font-bold text-green-800">{swap.environmentalImpact.totalCarbonSaved}kg</div>
                    <div className="text-sm text-green-600">CO2 Saved</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">💧</div>
                    <div className="text-2xl font-bold text-blue-800">{swap.environmentalImpact.waterSaved}L</div>
                    <div className="text-sm text-blue-600">Water Saved</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">♻️</div>
                    <div className="text-2xl font-bold text-purple-800">{swap.environmentalImpact.wasteReduced}kg</div>
                    <div className="text-sm text-purple-600">Waste Reduced</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Leaf className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">Environmental impact will be calculated when the swap is completed.</p>
                  <p className="text-sm text-green-600 mt-2">Estimated: {myItem.carbonSaving + theirItem.carbonSaving}kg CO2 saved</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logistics Tab */}
        {activeTab === 'logistics' && swap.exchangeMethod && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping & Logistics</h3>
            
            {swap.exchangeMethod.type === 'postal' && swap.exchangeMethod.details.shippingDetails && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tracking Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Tracking Information</h4>
                  
                  {/* Your shipment */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Your Shipment to {otherParty.username}</span>
                      <span className="text-xs text-gray-500">USPS</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {swap.exchangeMethod.details.shippingDetails.trackingNumbers.requesterToProvider}
                      </code>
                      <button
                        onClick={() => copyToClipboard(swap.exchangeMethod?.details?.shippingDetails?.trackingNumbers?.requesterToProvider || '')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=${swap.exchangeMethod?.details?.shippingDetails?.trackingNumbers?.requesterToProvider || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="text-sm text-gray-600">
                      Estimated Delivery: {new Date(swap.exchangeMethod.details.shippingDetails.estimatedDelivery.requesterItem).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Their shipment */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{otherParty.username}'s Shipment to You</span>
                      <span className="text-xs text-gray-500">USPS</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {swap.exchangeMethod.details.shippingDetails.trackingNumbers.providerToRequester}
                      </code>
                      <button
                        onClick={() => copyToClipboard(swap.exchangeMethod?.details?.shippingDetails?.trackingNumbers?.providerToRequester || '')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=${swap.exchangeMethod?.details?.shippingDetails?.trackingNumbers?.providerToRequester || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="text-sm text-gray-600">
                      Estimated Delivery: {new Date(swap.exchangeMethod.details.shippingDetails.estimatedDelivery.providerItem).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Next Steps</h4>
                  
                  {swap.status === 'in_transit' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Truck className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-orange-800">Items in Transit</span>
                      </div>
                      <p className="text-sm text-orange-700 mb-3">
                        Both items are on their way! Please confirm receipt when your item arrives.
                      </p>
                      <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                        I Received My Item
                      </button>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Contact {otherParty.username}</h5>
                    <div className="space-y-2">
                      <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800">
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                      <button className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-800">
                        <Phone className="w-4 h-4" />
                        <span>Request Phone Contact</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confirmation Checklist */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Checklist</h3>
              
              <div className="space-y-4">
                {/* Item Prepared */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      swap.verification.requesterConfirmations.itemPrepared.confirmed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Item Prepared</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {swap.verification.requesterConfirmations.itemPrepared.confirmed 
                      ? formatDate(swap.verification.requesterConfirmations.itemPrepared.timestamp)
                      : 'Pending'
                    }
                  </span>
                </div>

                {/* Item Sent */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      swap.verification.requesterConfirmations.itemSent.confirmed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Item Shipped</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {swap.verification.requesterConfirmations.itemSent.confirmed 
                      ? formatDate(swap.verification.requesterConfirmations.itemSent.timestamp)
                      : 'Pending'
                    }
                  </span>
                </div>

                {/* Item Received */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      swap.verification.requesterConfirmations.itemReceived.confirmed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-300 text-yellow-800'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Item Received</span>
                  </div>
                  {!swap.verification.requesterConfirmations.itemReceived.confirmed && (
                    <button className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600">
                      Confirm Receipt
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Verification */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Verification</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Before Shipping</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {swap.verification.photos.beforeShipping.requesterItem.length > 0 ? (
                      swap.verification.photos.beforeShipping.requesterItem.map((photo: string, index: number) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg"></div>
                      ))
                    ) : (
                      <div className="col-span-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload photos of your item</p>
                        <button className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600">
                          Upload Photos
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">After Receiving</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Photos will be uploaded upon receipt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Swap Timeline</h3>
            
            <div className="space-y-6">
              {swap.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{event.event}</h4>
                      <span className="text-xs text-gray-500">{formatDate(event.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                    {event.performedBy !== 'system' && (
                      <p className="text-xs text-gray-400 mt-1">
                        by {event.performedBy === currentUser.id ? 'You' : otherParty.username}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
