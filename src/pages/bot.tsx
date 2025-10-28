import React, { useState } from 'react';
import { MessageCircle, X, Send, Leaf } from 'lucide-react';

export default function FarmerChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! 👋 Welcome to Farmer Connect. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'Market prices',
    'Weather forecast',
    'Crop diseases',
    'Best practices'
  ];

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('price') || msg.includes('market')) {
      return 'I can help you check current market prices for your crops. Which crop are you interested in? We have real-time data for vegetables, fruits, grains, and livestock.';
    } else if (msg.includes('weather')) {
      return 'I can provide weather forecasts for your farm location. Please share your location or enable location services for accurate weather updates.';
    } else if (msg.includes('disease') || msg.includes('pest')) {
      return 'I can help identify crop diseases and suggest treatments. Please describe the symptoms or upload a photo of the affected plant for better diagnosis.';
    } else if (msg.includes('sell') || msg.includes('buyer')) {
      return 'Great! I can connect you with verified buyers. What products do you want to sell? Please provide details about quantity and quality.';
    } else if (msg.includes('loan') || msg.includes('finance')) {
      return 'I can guide you through available agricultural loans and financing options. Would you like information about government schemes or private financing?';
    } else if (msg.includes('fertilizer') || msg.includes('seed')) {
      return 'I can recommend fertilizers and quality seeds based on your soil type and crop. What crop are you planning to grow?';
    } else if (msg.includes('hello') || msg.includes('hi')) {
      return 'Hello! How can I assist you with your farming needs today?';
    } else {
      return 'I\'m here to help with market prices, crop management, connecting with buyers, weather updates, and farming advice. What would you like to know?';
    }
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: getBotResponse(inputValue),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
        >
          <MessageCircle size={28} />
          <span className="font-semibold">Ask FarmBot</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <Leaf className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">FarmBot Assistant</h3>
                <p className="text-xs text-green-100">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-800 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Quick Questions */}
          <div className="bg-green-50 p-3 border-b border-green-100">
            <p className="text-xs text-green-700 font-semibold mb-2">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
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
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-3 ${
                    msg.type === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
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
            {isTyping && (
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
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm"
              />
              <button
                onClick={handleSend}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2.5 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}