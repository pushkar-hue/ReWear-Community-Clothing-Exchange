'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, 
  Search, 
  User, 
  MessageCircle, 
  MoreVertical,
  Image as ImageIcon,
  Smile,
  Star,
  ArrowLeft,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Clock,
  Archive,
  Heart,
  Leaf,
  Recycle,
  Package,
  ShoppingBag
} from 'lucide-react';

// Types for messaging system
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'swap_request' | 'system';
  timestamp: string;
  read: boolean;
  swapDetails?: {
    itemOffered: {
      id: string;
      title: string;
      image: string;
      estimatedValue: number;
    };
    itemRequested: {
      id: string;
      title: string;
      image: string;
      estimatedValue: number;
    };
    status: 'pending' | 'accepted' | 'declined' | 'completed';
  };
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    username: string;
    avatar?: string;
    ecoLevel: string;
    isOnline: boolean;
    lastSeen: string;
  }[];
  lastMessage: Message;
  unreadCount: number;
  swapInProgress?: boolean;
}

interface SwapOffer {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredItem: {
    id: string;
    title: string;
    image: string;
    carbonSaving: number;
    value: number;
  };
  requestedItem: {
    id: string;
    title: string;
    image: string;
    carbonSaving: number;
    value: number;
  };
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  createdAt: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [currentUser] = useState({ id: 'current-user', username: 'EcoWarrior' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const loadMockData = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          participants: [
            { 
              id: 'user-1', 
              username: 'GreenFashionista', 
              ecoLevel: 'Gold',
              isOnline: true,
              lastSeen: new Date().toISOString(),
            },
            { 
              id: 'current-user', 
              username: 'EcoWarrior', 
              ecoLevel: 'Silver',
              isOnline: true,
              lastSeen: new Date().toISOString(),
            }
          ],
          lastMessage: {
            id: 'msg-1',
            senderId: 'user-1',
            receiverId: 'current-user',
            content: "I love your vintage denim jacket! Would you be interested in swapping for my organic cotton sweater?",
            type: 'text',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            read: false,
          },
          unreadCount: 2,
          swapInProgress: true,
        },
        {
          id: 'conv-2',
          participants: [
            { 
              id: 'user-2', 
              username: 'SustainableStyle', 
              ecoLevel: 'Platinum',
              isOnline: false,
              lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            { 
              id: 'current-user', 
              username: 'EcoWarrior', 
              ecoLevel: 'Silver',
              isOnline: true,
              lastSeen: new Date().toISOString(),
            }
          ],
          lastMessage: {
            id: 'msg-2',
            senderId: 'current-user',
            receiverId: 'user-2',
            content: "Thanks for the successful swap! Your item is exactly as described. 🌱",
            type: 'text',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: true,
          },
          unreadCount: 0,
          swapInProgress: false,
        },
        {
          id: 'conv-3',
          participants: [
            { 
              id: 'user-3', 
              username: 'CircularCloset', 
              ecoLevel: 'Diamond',
              isOnline: true,
              lastSeen: new Date().toISOString(),
            },
            { 
              id: 'current-user', 
              username: 'EcoWarrior', 
              ecoLevel: 'Silver',
              isOnline: true,
              lastSeen: new Date().toISOString(),
            }
          ],
          lastMessage: {
            id: 'msg-3',
            senderId: 'user-3',
            receiverId: 'current-user',
            content: "Hey! I saw your sustainable sneakers listing. Could we arrange a swap?",
            type: 'text',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            read: true,
          },
          unreadCount: 0,
          swapInProgress: false,
        },
      ];

      setConversations(mockConversations);
      setLoading(false);
    };

    loadMockData();
  }, []);

  // Load messages for active conversation
  useEffect(() => {
    if (activeConversation) {
      const mockMessages: Message[] = [
        {
          id: 'msg-conv1-1',
          senderId: 'user-1',
          receiverId: 'current-user',
          content: "Hi! I noticed you have a vintage denim jacket listed. It looks amazing!",
          type: 'text',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: 'msg-conv1-2',
          senderId: 'current-user',
          receiverId: 'user-1',
          content: "Thank you! It's one of my favorites but I'm ready to give it a new home. Are you interested in a swap?",
          type: 'text',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: 'msg-conv1-3',
          senderId: 'user-1',
          receiverId: 'current-user',
          content: "Absolutely! I have this beautiful organic cotton sweater that might interest you.",
          type: 'text',
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: 'msg-conv1-4',
          senderId: 'user-1',
          receiverId: 'current-user',
          content: "I love your vintage denim jacket! Would you be interested in swapping for my organic cotton sweater?",
          type: 'swap_request',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          read: false,
          swapDetails: {
            itemOffered: {
              id: 'item-1',
              title: 'Organic Cotton Sweater',
              image: '/placeholder-sweater.jpg',
              estimatedValue: 45,
            },
            itemRequested: {
              id: 'item-2',
              title: 'Vintage Denim Jacket',
              image: '/placeholder-jacket.jpg',
              estimatedValue: 55,
            },
            status: 'pending',
          }
        }
      ];
      setMessages(mockMessages);
    }
  }, [activeConversation]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: activeConversation.participants.find(p => p.id !== currentUser.id)?.id || '',
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation's last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id
          ? { ...conv, lastMessage: message }
          : conv
      )
    );
  }, [newMessage, activeConversation, currentUser.id]);

  const handleSwapResponse = (accept: boolean, messageId: string) => {
    const systemMessage: Message = {
      id: `msg-system-${Date.now()}`,
      senderId: 'system',
      receiverId: '',
      content: accept 
        ? "🎉 Swap request accepted! You can now coordinate the exchange details."
        : "Swap request declined. Feel free to make a counter-offer!",
      type: 'system',
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages(prev => [
      ...prev.map(msg => 
        msg.id === messageId && msg.swapDetails 
          ? { 
              ...msg, 
              swapDetails: { 
                ...msg.swapDetails, 
                status: accept ? 'accepted' : 'declined' 
              } 
            }
          : msg
      ),
      systemMessage
    ]);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getEcoLevelColor = (level: string) => {
    const colors = {
      Bronze: 'text-amber-600',
      Silver: 'text-gray-600',
      Gold: 'text-yellow-600',
      Platinum: 'text-purple-600',
      Diamond: 'text-blue-600',
      Master: 'text-green-600',
    };
    return colors[level as keyof typeof colors] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading your conversations...</h2>
          <p className="text-gray-500">Connecting you with your swap community</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-8 h-8 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              </div>
              <div className="text-sm text-gray-500">
                Connect with eco-warriors for sustainable swaps 🌱
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[80vh] flex">
          {/* Conversations Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
                if (!otherParticipant) return null;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeConversation?.id === conversation.id ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        {otherParticipant.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 truncate">{otherParticipant.username}</h3>
                            <span className={`text-xs ${getEcoLevelColor(otherParticipant.ecoLevel)}`}>
                              {otherParticipant.ecoLevel}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {conversation.swapInProgress && (
                              <Recycle className="w-4 h-4 text-green-500" />
                            )}
                            <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  {(() => {
                    const otherParticipant = activeConversation.participants.find(p => p.id !== currentUser.id);
                    return (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            {otherParticipant?.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{otherParticipant?.username}</h3>
                            <p className="text-sm text-gray-500">
                              {otherParticipant?.isOnline ? 'Online now' : `Last seen ${formatTime(otherParticipant?.lastSeen || '')}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                            <Phone className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                            <Video className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                            <Info className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.type === 'system' ? (
                        <div className="text-center">
                          <div className="inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
                            {message.content}
                          </div>
                        </div>
                      ) : message.type === 'swap_request' ? (
                        <div className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-md bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Recycle className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-800">Swap Request</span>
                            </div>
                            
                            {message.swapDetails && (
                              <div className="space-y-3">
                                <p className="text-sm text-gray-700">{message.content}</p>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="text-center">
                                    <div className="bg-white rounded-lg p-3 border">
                                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                                      <p className="text-xs font-medium">{message.swapDetails.itemOffered.title}</p>
                                      <p className="text-xs text-gray-500">${message.swapDetails.itemOffered.estimatedValue}</p>
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">Offering</p>
                                  </div>
                                  
                                  <div className="text-center">
                                    <div className="bg-white rounded-lg p-3 border">
                                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                                      <p className="text-xs font-medium">{message.swapDetails.itemRequested.title}</p>
                                      <p className="text-xs text-gray-500">${message.swapDetails.itemRequested.estimatedValue}</p>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-1">Requesting</p>
                                  </div>
                                </div>

                                {message.senderId !== currentUser.id && message.swapDetails.status === 'pending' && (
                                  <div className="flex space-x-2 mt-3">
                                    <button
                                      onClick={() => handleSwapResponse(true, message.id)}
                                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-600"
                                    >
                                      Accept Swap
                                    </button>
                                    <button
                                      onClick={() => handleSwapResponse(false, message.id)}
                                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-400"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                )}

                                {message.swapDetails.status === 'accepted' && (
                                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm text-center">
                                    ✅ Swap Accepted!
                                  </div>
                                )}

                                {message.swapDetails.status === 'declined' && (
                                  <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm text-center">
                                    ❌ Swap Declined
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                              <span>{formatTime(message.timestamp)}</span>
                              {message.senderId === currentUser.id && (
                                <div className="flex items-center space-x-1">
                                  {message.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === currentUser.id
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <div className={`flex items-center justify-between text-xs mt-1 ${
                              message.senderId === currentUser.id ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              <span>{formatTime(message.timestamp)}</span>
                              {message.senderId === currentUser.id && (
                                <div className="flex items-center space-x-1">
                                  {message.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                        <ImageIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                        <Package className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-500">Choose a conversation from the sidebar to start chatting with eco-warriors!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}