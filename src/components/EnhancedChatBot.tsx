import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Leaf, Image as ImageIcon } from 'lucide-react';
import { getGeminiResponse, analyzeImage } from '../services/geminiService';

interface Message {
  type: 'user' | 'bot';
  text: string;
  time: string;
}

const MAX_REQUESTS = 50;

const QUICK_QUESTIONS = [
  'How do I control pests naturally?',
  'Best crops for rainy season',
  'Current market prices',
  'Soil improvement tips'
];

const INITIAL_MESSAGE = {
  type: 'bot' as const,
  text: 'Hello! 👋 Welcome to Farmer Connect. I\'m here to help with all your farming questions - from crop management to market prices. How can I assist you today?',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

interface ChatState {
  isOpen: boolean;
  messages: Message[];
  inputValue: string;
  isTyping: boolean;
  requestCount: number;
  apiStatus: 'initializing' | 'ready' | 'error';
  errorMessage: string;
  retryAttempts: number;
}

const initialState: ChatState = {
  isOpen: false,
  messages: [INITIAL_MESSAGE],
  inputValue: '',
  isTyping: false,
  requestCount: 0,
  apiStatus: 'initializing',
  errorMessage: '',
  retryAttempts: 0
};

export default function EnhancedChatBot() {
  const [state, setState] = useState<ChatState>(initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  useEffect(() => {
    // Check API status on component mount
    const checkApiStatus = async () => {
      try {
        const testMessage = "Test connection";
        await getGeminiResponse(testMessage, []);
        setState(prev => ({ ...prev, apiStatus: 'ready' }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          apiStatus: 'error',
          errorMessage: 'Failed to initialize API connection. Please check your API key.'
        }));
      }
    };

    checkApiStatus();
  }, []);

  const handleSend = async () => {
    if (state.inputValue.trim() === '' || state.requestCount >= MAX_REQUESTS) return;
    if (state.apiStatus !== 'ready') {
      setState(prev => ({
        ...prev,
        errorMessage: 'API is not ready. Please wait or refresh the page.'
      }));
      return;
    }

    const userMessage = {
      type: 'user',
      text: state.inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } as Message;

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      inputValue: '',
      isTyping: true,
      requestCount: prev.requestCount + 1,
      errorMessage: ''
    }));

    const currentInput = state.inputValue;

    try {
      const botResponseText = await getGeminiResponse(currentInput, state.messages);
      
      const botResponse = {
        type: 'bot',
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } as Message;
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botResponse],
        isTyping: false,
        retryAttempts: 0
      }));
    } catch (error: any) {
      const errorMessage = error.message?.includes('API key') 
        ? 'API key error. Please check your configuration.'
        : error.message?.includes('quota')
        ? 'API quota exceeded. Please try again later.'
        : 'An error occurred. Please try again.';

      const errorResponse = {
        type: 'bot',
        text: errorMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } as Message;

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorResponse],
        isTyping: false,
        errorMessage,
        retryAttempts: prev.retryAttempts + 1,
        apiStatus: prev.retryAttempts >= 3 ? 'error' : prev.apiStatus
      }));
    }
  };

  const handleQuickQuestion = (question: string) => {
    setState(prev => ({ ...prev, inputValue: question }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (state.requestCount >= MAX_REQUESTS) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-red-100 p-4 rounded-lg shadow-lg">
        <p className="text-red-600">Daily limit reached. Please try again tomorrow.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Chat Button */}
      {!state.isOpen && (
        <button
          onClick={() => setState(prev => ({ ...prev, isOpen: true }))}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
          disabled={state.apiStatus === 'error'}
        >
          <MessageCircle size={28} />
          <span className="font-semibold">Ask FarmBot</span>
        </button>
      )}

      {/* Chat Window */}
      {state.isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <Leaf className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">FarmBot Assistant</h3>
                <p className="text-xs text-green-100">
                  Status: {state.apiStatus === 'ready' ? 'Online' : state.apiStatus === 'error' ? 'Error' : 'Connecting...'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setState(prev => ({ ...prev, isOpen: false }))}
              className="hover:bg-green-800 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* API Status Message */}
          {state.apiStatus !== 'ready' && (
            <div className={`p-3 text-sm ${
              state.apiStatus === 'error' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
            }`}>
              {state.apiStatus === 'error' 
                ? state.errorMessage || 'Error connecting to API. Please check your configuration.' 
                : 'Initializing connection...'}
            </div>
          )}

          {/* Quick Questions */}
          <div className="bg-green-50 p-3 border-b border-green-100">
            <p className="text-xs text-green-700 font-semibold mb-2">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="bg-white text-green-700 text-xs px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors border border-green-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {state.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.type === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-green-100' : 'text-gray-400'
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {state.isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={state.inputValue}
                onChange={(e) => setState(prev => ({ ...prev, inputValue: e.target.value }))}
                onKeyPress={handleKeyPress}
                placeholder="Ask about farming, crops, pests..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm"
                disabled={state.isTyping || state.apiStatus !== 'ready'}
              />
              <button
                onClick={handleSend}
                disabled={state.isTyping || !state.inputValue.trim() || state.apiStatus !== 'ready'}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2.5 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
            {state.requestCount > MAX_REQUESTS * 0.8 && (
              <p className="text-xs text-amber-600 mt-2">
                Warning: Approaching daily message limit ({MAX_REQUESTS - state.requestCount} remaining)
              </p>
            )}
            {state.errorMessage && (
              <p className="text-xs text-red-600 mt-2">
                {state.errorMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}