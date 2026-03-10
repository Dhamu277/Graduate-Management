import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !sessionId) {
      initChat();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initChat = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/chat/session');
      setSessionId(data.session._id);
      setMessages(data.messages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userMsg = { _id: Date.now(), sender: 'User', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/chat/message', {
        sessionId,
        text: userMsg.text
      });
      // Replace pessimistic message with actual response
      setMessages(prev => [...prev.filter(m => m._id !== userMsg._id), data.userMessage, data.botMessage]);
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-105 z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right" style={{ maxHeight: '600px', height: 'calc(100vh - 48px)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full"><Bot size={20} /></div>
              <div>
                <h3 className="font-bold leading-none">Alumni Helper AI</h3>
                <span className="text-xs text-blue-100 flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={msg._id || i} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.sender === 'User' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-tl-sm px-4 py-3 text-sm flex gap-1 items-center shadow-sm">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <form onSubmit={sendMessage} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="w-full bg-gray-100 text-sm rounded-full pl-4 pr-12 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 border border-transparent transition-all"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-1 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 p-2 rounded-full transition-colors"
              >
                <Send size={16} className="translate-x-[-1px] translate-y-[1px]" />
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Powered by AI</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
