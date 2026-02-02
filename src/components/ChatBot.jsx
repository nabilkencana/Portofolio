import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { botContext } from '../data/botContext';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya AI Nabil. Ada yang bisa saya bantu tentang portofolio Nabil?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMessage = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('API_KEY_MISSING');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: botContext,
      });

      // Filter history to alternate user/model and start with user
      const history = messages
        .filter((msg, index) => index > 0) // Exclude the initial greeting
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));

      const chat = model.startChat({ history });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("ChatBot Error:", error);

      // Fallback Mock Logic
      const lowerInput = userText.toLowerCase();
      let fallbackResponse = "";

      if (lowerInput.includes('siapa') || lowerInput.includes('nabil')) {
        fallbackResponse = "Nabil Kencana adalah seorang Fullstack Developer, Mobile App Developer, dan UI/UX Designer yang bersekolah di SMK Telkom Malang.";
      } else if (lowerInput.includes('proyek') || lowerInput.includes('project')) {
        fallbackResponse = "Nabil memiliki beberapa proyek menarik seperti Website Wayang Interaktif, Aplikasi WargaKita, dan EcoGuard AI. Kamu bisa cek detailnya di halaman Proyek!";
      } else if (lowerInput.includes('skill') || lowerInput.includes('kemampuan') || lowerInput.includes('tech')) {
        fallbackResponse = "Nabil ahli dalam ReactJS, Tailwind CSS, Flutter, NestJS, dan beberapa teknologi modern lainnya.";
      } else if (lowerInput.includes('kontak') || lowerInput.includes('hubungi')) {
        fallbackResponse = "Kamu bisa menghubungi Nabil melalui halaman Kontak atau sosial medianya seperti LinkedIn dan Instagram.";
      } else if (error.message === 'API_KEY_MISSING') {
        fallbackResponse = "Saya AI Nabil. Ada yang bisa saya bantu tentang portofolio atau pengalaman Nabil? (Catatan: API Key belum dikonfigurasi, menggunakan mode demo)";
      } else {
        fallbackResponse = "Maaf, saya sedang mengalami kendala teknis. Silakan coba lagi nanti atau hubungi Nabil langsung.";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] sm:w-[350px] h-[500px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-800 flex items-center justify-between border-b border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-(--accent) flex items-center justify-center">
                  <Bot size={20} className="text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Nabil AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-300">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-zinc-700 rounded-full transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                        ? 'bg-(--accent) text-black rounded-tr-none'
                        : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-zinc-100 p-3 rounded-2xl rounded-tl-none border border-zinc-700">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya sesuatu..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-(--accent) transition-colors text-white placeholder:text-zinc-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-(--accent) text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="w-14 h-14 bg-(--accent) rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform duration-200"
      >
        {isOpen ? (
          <X size={28} className="text-black" />
        ) : (
          <MessageSquare size={28} className="text-black" />
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;