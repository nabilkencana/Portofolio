import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Loader2, Trash2, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { botContext } from '../data/botContext';

const renderMessageContent = (text) => {
  if (typeof text !== 'string') return text;
  
  const lines = text.split('\n');
  
  return lines.map((line, i) => {
    let cleanLine = line;

    // Handle bullet points (* or -)
    const isBullet = /^\s*[\*\-]\s+(.*)/.test(line);
    // Handle numbered lists (1. 2. etc.)
    const isNumbered = /^\s*(\d+)\.\s+(.*)/.test(line);

    if (isBullet) {
      const match = line.match(/^\s*[\*\-]\s+(.*)/);
      cleanLine = match[1];
    } else if (isNumbered) {
      const match = line.match(/^\s*(\d+)\.\s+(.*)/);
      cleanLine = match[2];
    }

    // Parse bold tags: **text**
    const parts = [];
    let currentIdx = 0;
    const regex = /\*\*(.*?)\*\*/g;
    let match;

    while ((match = regex.exec(cleanLine)) !== null) {
      if (match.index > currentIdx) {
        parts.push(cleanLine.substring(currentIdx, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-bold text-(--accent)">
          {match[1]}
        </strong>
      );
      currentIdx = regex.lastIndex;
    }

    if (currentIdx < cleanLine.length) {
      parts.push(cleanLine.substring(currentIdx));
    }

    // Render list items
    if (isBullet) {
      return (
        <li key={i} className="ml-4 list-disc mb-1 pl-0.5 text-zinc-200">
          {parts}
        </li>
      );
    }
    if (isNumbered) {
      return (
        <li key={i} className="ml-4 list-decimal mb-1 pl-0.5 text-zinc-200">
          {parts}
        </li>
      );
    }

    // Empty lines
    if (cleanLine.trim() === '') {
      return <div key={i} className="h-2" />;
    }

    return (
      <p key={i} className="mb-1.5 last:mb-0 text-zinc-100">
        {parts}
      </p>
    );
  });
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Halo! Saya AI Nabil. Ada yang bisa saya bantu tentang portofolio Nabil?' }
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "Siapa Nabil?",
    "Apa saja proyeknya?",
    "Apa keahliannya?",
    "Kontak Nabil"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const clearChat = () => {
    const initialMessage = [{ role: 'assistant', content: 'Halo! Saya AI Nabil. Ada yang bisa saya bantu tentang portofolio Nabil?' }];
    setMessages(initialMessage);
    localStorage.setItem('chat_history', JSON.stringify(initialMessage));
  };

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const messageText = textOverride || input.trim();
    if (!messageText || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
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

      const result = await chat.sendMessage(messageText);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("ChatBot Error:", error);

      // Fallback Mock Logic
      const lowerInput = messageText.toLowerCase();
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] sm:w-[380px] h-[550px] bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-800/50 flex items-center justify-between border-b border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-(--accent) flex items-center justify-center shadow-lg">
                  <Bot size={24} className="text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    Nabil AI Assistant
                    <Sparkles size={12} className="text-(--accent)" />
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Hapus Percakapan"
                  className="p-2 hover:bg-zinc-700/50 rounded-full transition-colors text-zinc-400 hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-2 hover:bg-zinc-700/50 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                        ? 'bg-(--accent) text-black rounded-tr-none font-medium'
                        : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700/50'
                      }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="space-y-1">{renderMessageContent(msg.content)}</div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-zinc-100 p-4 rounded-2xl rounded-tl-none border border-zinc-700/50">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {!isLoading && messages.length <= 1 && (
              <div className="px-4 py-2 flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(null, q)}
                    className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-zinc-800/50 flex gap-2 bg-zinc-900/50">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya sesuatu..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-(--accent) transition-all text-white placeholder:text-zinc-600 shadow-inner"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-(--accent) text-black rounded-xl hover:opacity-90 transition-all disabled:opacity-30 disabled:grayscale shadow-lg active:scale-95"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="w-14 h-14 bg-(--accent) rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] cursor-pointer transition-all duration-300 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={28} className="text-black" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageSquare size={28} className="text-black" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatBot;
