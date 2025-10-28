import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function ChatBot() {
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

  const getBotResponse = (userMessage: string) => {
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
      return "I'm here to help with market prices, crop management, connecting with buyers, weather updates, and farming advice. What would you like to know?";
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

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
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
            <div className="flex items-center gap-2">
              <MessageCircle size={24} />
              <div>
                <h3 className="font-semibold">FarmBot Assistant</h3>
                <p className="text-sm text-green-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-green-100 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Quick Questions */}
          <div className="p-4 bg-green-50/50 flex gap-2 overflow-x-auto">
            {quickQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm whitespace-nowrap hover:bg-green-200"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    message.type === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}
                  >
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-xl rounded-bl-none">
                  <p>Typing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-green-500"
              />
              <button
                onClick={handleSend}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}