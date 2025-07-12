'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Wand2, 
  Star, 
  Heart, 
  Share2, 
  Download, 
  RefreshCw, 
  Zap,
  Play,
  Pause,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  Shirt,
  Scissors,
  Palette,
  Eye,
  Lightbulb,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';

// Types for AR styling
interface StyleRecommendation {
  id: string;
  name: string;
  category: string;
  confidence: number;
  description: string;
  style_tags: string[];
  color_palette: string[];
  season: string;
  occasion: string[];
  body_type_match: number;
  sustainability_score: number;
}

interface ARSession {
  isActive: boolean;
  currentItem: string | null;
  recommendations: StyleRecommendation[];
  capturedImages: string[];
}

export default function ARStylingPage() {
  const [arSession, setArSession] = useState<ARSession>({
    isActive: false,
    currentItem: null,
    recommendations: [],
    capturedImages: []
  });
  const [selectedRecommendation, setSelectedRecommendation] = useState<StyleRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'gallery'>('camera');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraPermission('granted');
      } catch (error) {
        console.error('Camera access denied:', error);
        setCameraPermission('denied');
      }
    };

    if (activeTab === 'camera') {
      initializeCamera();
    }

    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab]);

  // Mock AR styling recommendations
  const mockRecommendations: StyleRecommendation[] = [
    {
      id: 'rec1',
      name: 'Vintage Denim Ensemble',
      category: 'Casual Chic',
      confidence: 94,
      description: 'A perfectly curated vintage denim look that combines sustainability with timeless style. This ensemble features high-waisted mom jeans paired with a cropped denim jacket.',
      style_tags: ['vintage', 'casual', 'sustainable', 'classic'],
      color_palette: ['#4A90E2', '#87CEEB', '#F5F5DC', '#FFFFFF'],
      season: 'Spring/Fall',
      occasion: ['casual', 'weekend', 'coffee_date', 'shopping'],
      body_type_match: 92,
      sustainability_score: 88
    },
    {
      id: 'rec2',
      name: 'Earth-Tone Layering',
      category: 'Sustainable Fashion',
      confidence: 89,
      description: 'Embrace earthy tones with this eco-conscious layering approach. Features organic cotton basics with a recycled wool cardigan for a cozy, sustainable look.',
      style_tags: ['earth_tones', 'layering', 'organic', 'cozy'],
      color_palette: ['#8B4513', '#D2691E', '#F4A460', '#DEB887'],
      season: 'Fall/Winter',
      occasion: ['work', 'casual', 'outdoor', 'travel'],
      body_type_match: 87,
      sustainability_score: 95
    },
    {
      id: 'rec3',
      name: 'Modern Minimalist',
      category: 'Contemporary',
      confidence: 91,
      description: 'Clean lines and neutral tones create a sophisticated minimalist aesthetic. This capsule-inspired look maximizes versatility while minimizing environmental impact.',
      style_tags: ['minimalist', 'clean', 'modern', 'versatile'],
      color_palette: ['#000000', '#FFFFFF', '#F5F5F5', '#E0E0E0'],
      season: 'All Season',
      occasion: ['work', 'formal', 'evening', 'presentation'],
      body_type_match: 85,
      sustainability_score: 82
    }
  ];

  const startARSession = () => {
    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setArSession({
        isActive: true,
        currentItem: 'user_photo',
        recommendations: mockRecommendations,
        capturedImages: []
      });
      setLoading(false);
    }, 2000);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setArSession(prev => ({
          ...prev,
          capturedImages: [...prev.capturedImages, imageData]
        }));
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setLoading(true);
        
        // Simulate AI processing
        setTimeout(() => {
          setArSession({
            isActive: true,
            currentItem: imageData,
            recommendations: mockRecommendations,
            capturedImages: [imageData]
          });
          setLoading(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-blue-600 bg-blue-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AR Styling Assistant</h1>
                  <p className="text-sm text-gray-500">AI-powered sustainable fashion recommendations</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Powered by</p>
                <p className="font-medium text-purple-600">LangChain AI</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!arSession.isActive ? (
          /* Initial Interface */
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Discover Your Perfect Sustainable Style
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your photo or use live camera to get personalized, AI-powered fashion recommendations 
                focused on sustainable and eco-friendly clothing choices.
              </p>
            </div>

            {/* Method Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex justify-center mb-8">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {[
                    { id: 'camera', label: 'Live Camera', icon: Camera },
                    { id: 'upload', label: 'Upload Photo', icon: Upload },
                    { id: 'gallery', label: 'Sample Gallery', icon: Star }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                        activeTab === id
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Interface */}
              {activeTab === 'camera' && (
                <div className="space-y-6">
                  {cameraPermission === 'pending' && (
                    <div className="text-center py-12">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Camera Access Required</h3>
                      <p className="text-gray-600 mb-6">Please allow camera access to use AR styling features.</p>
                    </div>
                  )}

                  {cameraPermission === 'denied' && (
                    <div className="text-center py-12">
                      <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Camera Access Denied</h3>
                      <p className="text-gray-600 mb-6">Please enable camera permissions in your browser settings or try uploading a photo instead.</p>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Switch to Upload
                      </button>
                    </div>
                  )}

                  {cameraPermission === 'granted' && (
                    <div className="space-y-6">
                      <div className="relative bg-black rounded-xl overflow-hidden aspect-video max-w-2xl mx-auto">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-64 h-64 border-2 border-white/50 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={capturePhoto}
                          className="bg-white border-4 border-purple-500 p-4 rounded-full hover:bg-purple-50 transition-colors"
                        >
                          <Camera className="w-8 h-8 text-purple-500" />
                        </button>
                        <button
                          onClick={startARSession}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:shadow-lg transition-all flex items-center space-x-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              <span>Start AR Styling</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Interface */}
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center bg-purple-50">
                    <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Photo</h3>
                    <p className="text-gray-600 mb-6">Choose a clear photo of yourself for the best styling recommendations</p>
                    <label className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      Choose Photo
                    </label>
                  </div>
                  
                  {loading && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center space-x-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-purple-500" />
                        <span className="text-purple-600 font-medium">AI is analyzing your style...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sample Gallery */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 text-center">Try Our Sample Styles</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Casual Day', image: '/sample-casual.jpg' },
                      { name: 'Business Chic', image: '/sample-business.jpg' },
                      { name: 'Weekend Vibes', image: '/sample-weekend.jpg' },
                      { name: 'Evening Elegant', image: '/sample-evening.jpg' }
                    ].map((sample, index) => (
                      <button
                        key={index}
                        onClick={startARSession}
                        className="group relative aspect-square bg-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-3 left-3 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {sample.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Lightbulb,
                  title: 'AI-Powered Recommendations',
                  description: 'Get personalized style suggestions based on your body type, preferences, and sustainable fashion trends.'
                },
                {
                  icon: Target,
                  title: 'Sustainability Focused',
                  description: 'All recommendations prioritize eco-friendly, ethically-made, and second-hand clothing options.'
                },
                {
                  icon: TrendingUp,
                  title: 'Style Evolution',
                  description: 'Track your style journey and see how your fashion choices contribute to environmental impact.'
                }
              ].map(({ icon: Icon, title, description }, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm">{description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* AR Session Active */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main AR View */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="font-medium">AR Session Active</span>
                    </div>
                    <button
                      onClick={() => setArSession({ isActive: false, currentItem: null, recommendations: [], capturedImages: [] })}
                      className="text-white/80 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="aspect-video bg-gray-900 relative">
                  {arSession.currentItem && (
                    <img
                      src={arSession.currentItem.startsWith('data:') ? arSession.currentItem : '/placeholder-ar-view.jpg'}
                      alt="AR View"
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* AR Overlay Elements */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      AI Analyzing...
                    </div>
                    
                    {/* Style points overlay */}
                    <div className="absolute top-1/4 right-1/4 w-4 h-4 border-2 border-purple-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/3 left-1/5 w-4 h-4 border-2 border-pink-400 rounded-full animate-ping"></div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600">
                        <Camera className="w-5 h-5" />
                      </button>
                      <button className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Sparkles className="w-4 h-4" />
                      <span>{arSession.recommendations.length} recommendations found</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Style Recommendations</span>
                </h3>
                
                <div className="space-y-4">
                  {arSession.recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedRecommendation?.id === rec.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setSelectedRecommendation(rec)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{rec.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(rec.confidence)}`}>
                          {rec.confidence}%
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          {rec.color_palette.slice(0, 4).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-green-600">
                          <Award className="w-3 h-3" />
                          <span>{rec.sustainability_score}% sustainable</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rec.style_tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Recommendation */}
              {selectedRecommendation && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span>Style Details</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{selectedRecommendation.name}</h4>
                      <p className="text-sm text-gray-600">{selectedRecommendation.category}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Season:</span>
                        <p className="text-gray-600">{selectedRecommendation.season}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Body Match:</span>
                        <p className="text-gray-600">{selectedRecommendation.body_type_match}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Occasions:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedRecommendation.occasion.map((occ, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {occ.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all">
                      Find Similar Items
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
