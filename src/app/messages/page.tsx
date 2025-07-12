'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  itemId?: string;
  itemName?: string;
  messageType: 'text' | 'swap_request' | 'swap_accepted' | 'swap_declined';
}

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login?redirect=/messages');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadConversations();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  // Mock data for demonstration
  const loadConversations = () => {
    const mockConversations: Conversation[] = [
      {
        userId: 'user_123',
        userName: 'Sarah Chen',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612663e?w=40&h=40&fit=crop&crop=face',
        lastMessage: 'Hi! Is your vintage jacket still available?',
        lastMessageTime: '2 min ago',
        unreadCount: 2,
        isOnline: true
      },
      {
        userId: 'user_456',
        userName: 'Mike Rodriguez',
        userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face',
        lastMessage: 'Thanks for the swap! The boots are perfect 👢',
        lastMessageTime: '1 hour ago',
        unreadCount: 0,
        isOnline: false
      },
      {
        userId: 'user_789',
        userName: 'Emma Wilson',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        lastMessage: 'Would you be interested in swapping for my designer dress?',
        lastMessageTime: '3 hours ago',
        unreadCount: 1,
        isOnline: true
      }
    ];
    
    setConversations(mockConversations);
    setLoading(false);
  };

  const loadMessages = (userId: string) => {
    const mockMessages: Message[] = [
      {
        id: 'msg_1',
        senderId: userId,
        senderName: 'Sarah Chen',
        receiverId: user?.id || 'current_user',
        content: 'Hi! I saw your vintage denim jacket listing. Is it still available?',
        timestamp: '2024-01-15T10:30:00Z',
        read: true,
        messageType: 'text'
      },
      {
        id: 'msg_2',
        senderId: user?.id || 'current_user',
        senderName: user?.username || 'You',
        receiverId: userId,
        content: 'Yes, it\'s still available! Are you interested in a swap?',
        timestamp: '2024-01-15T10:35:00Z',
        read: true,
        messageType: 'text'
      },
      {
        id: 'msg_3',
        senderId: userId,
        senderName: 'Sarah Chen',
        receiverId: user?.id || 'current_user',
        content: 'Perfect! I have a designer sweater that might interest you. Would you like to see it?',
        timestamp: '2024-01-15T10:40:00Z',
        read: true,
        messageType: 'text'
      },
      {
        id: 'msg_4',
        senderId: userId,
        senderName: 'Sarah Chen',
        receiverId: user?.id || 'current_user',
        content: 'I\'d like to propose a swap for your vintage jacket',
        timestamp: '2024-01-15T10:45:00Z',
        read: false,
        itemId: 'item_123',
        itemName: 'Cashmere Designer Sweater',
        messageType: 'swap_request'
      }
    ];
    
    setMessages(mockMessages);
    setActiveConversation(userId);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || 'current_user',
      senderName: user?.username || 'You',
      receiverId: activeConversation,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      messageType: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSwapResponse = (messageId: string, response: 'accept' | 'decline') => {
    // Mock swap response
    const responseMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || 'current_user',
      senderName: user?.username || 'You',
      receiverId: activeConversation!,
      content: response === 'accept' ? 'Swap request accepted! 🎉' : 'Thanks for the offer, but I\'ll pass this time.',
      timestamp: new Date().toISOString(),
      read: false,
      messageType: response === 'accept' ? 'swap_accepted' : 'swap_declined'
    };

    setMessages(prev => [...prev, responseMessage]);
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestamp;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ReWear Messages
                </span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              💬 Real-time messaging
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-180px)] flex">
          {/* Conversations Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <p className="text-sm text-gray-600">{conversations.length} active chats</p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  onClick={() => loadMessages(conversation.userId)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    activeConversation === conversation.userId ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.userAvatar}
                        alt={conversation.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.userName}</h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-500">{conversation.lastMessageTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <img
                      src={conversations.find(c => c.userId === activeConversation)?.userAvatar}
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">
                        {conversations.find(c => c.userId === activeConversation)?.userName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {conversations.find(c => c.userId === activeConversation)?.isOnline ? (
                          <span className="text-green-600">● Online</span>
                        ) : (
                          'Last seen recently'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${message.senderId === user?.id ? 'order-2' : 'order-1'}`}>
                        {message.messageType === 'swap_request' ? (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">🔄</span>
                              <span className="font-medium text-yellow-800">Swap Request</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{message.content}</p>
                            {message.itemName && (
                              <div className="bg-white rounded p-2 mb-3">
                                <p className="text-sm font-medium">Item: {message.itemName}</p>
                              </div>
                            )}
                            {message.senderId !== user?.id && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSwapResponse(message.id, 'accept')}
                                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleSwapResponse(message.id, 'decline')}
                                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        ) : message.messageType === 'swap_accepted' ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">✅</span>
                              <span className="font-medium text-green-800">{message.content}</span>
                            </div>
                          </div>
                        ) : message.messageType === 'swap_declined' ? (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">❌</span>
                              <span className="font-medium text-red-800">{message.content}</span>
                            </div>
                          </div>
                        ) : (
                          <div className={`rounded-lg px-4 py-2 ${
                            message.senderId === user?.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p>{message.content}</p>
                          </div>
                        )}
                        <p className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-right text-gray-400' : 'text-left text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
