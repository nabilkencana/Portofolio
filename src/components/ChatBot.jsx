import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Loader2, Trash2, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { botContext, fetchDynamicBotContext } from '../data/botContext';

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

      const dynamicContext = await fetchDynamicBotContext('nabilkencana');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: dynamicContext,
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
      } else if (lowerInput.includes('proyek') || lowerInput.includes('project') || lowerInput.includes('repo') || lowerInput.includes('github')) {
        fallbackResponse = "Nabil aktif mengembangkan berbagai proyek web, mobile, backend API (Golang & NestJS), serta sistem berbasis AI. Kamu bisa cek repositori terbaru dan detailnya di halaman Proyek atau GitHub Nabil (github.com/nabilkencana)!";
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
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mb-4 w-[90vw] sm:w-[400px] h-[580px] flex flex-col overflow-hidden relative rounded-3xl"
            style={{
              background: "rgba(18, 18, 22, 0.72)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 8px 40px 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Liquid glass shimmer highlight at top */}
            <div
              className="absolute top-0 left-0 right-0 h-px shrink-0"
              style={{ background: "rgba(255,255,255,0.18)" }}
            />
            {/* Subtle inner glow for depth */}
            <div
              className="absolute top-0 left-0 right-0 h-24 pointer-events-none rounded-t-3xl"
              style={{ background: "rgba(255,255,255,0.025)" }}
            />

            {/* Header */}
            <div
              className="p-4 flex items-center justify-between shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    <Bot size={22} className="text-(--accent)" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-zinc-950"></span>
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                    Nabil AI Assistant
                    <Sparkles size={13} className="text-(--accent) animate-pulse" />
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Powered by Gemini AI
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Hapus Percakapan"
                  aria-label="Hapus percakapan"
                  className="p-2 rounded-xl transition-all text-zinc-400 hover:text-red-400 cursor-pointer"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Trash2 size={17} />
                </button>
                <button
                  onClick={toggleChat}
                  aria-label="Tutup chatbot"
                  className="p-2 rounded-xl transition-all text-zinc-400 hover:text-white cursor-pointer"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed`}
                    style={
                      msg.role === 'user'
                        ? {
                          background: "var(--accent)",
                          color: "#000",
                          fontWeight: 600,
                          boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
                        }
                        : {
                          background: "rgba(255,255,255,0.06)",
                          color: "rgba(228,228,231,1)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                        }
                    }
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
                  <div
                    className="p-3.5 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>Nabil AI sedang berpikir</span>
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-1.5 h-1.5 bg-(--accent) rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-1.5 h-1.5 bg-(--accent) rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-1.5 h-1.5 bg-(--accent) rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {!isLoading && messages.length <= 1 && (
              <div
                className="px-4 py-2.5 flex flex-wrap gap-1.5 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(null, q)}
                    className="text-[11px] text-zinc-300 hover:text-zinc-100 px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.11)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 flex items-center gap-2 shrink-0"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.025)",
              }}
            >
              <div
                className="relative flex-1 flex items-center rounded-2xl px-3.5 py-1.5 transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya tentang skill, repo, atau proyek..."
                  aria-label="Pesan untuk AI Assistant"
                  className="w-full bg-transparent border-none text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none py-1"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Kirim pesan"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:grayscale cursor-pointer disabled:cursor-not-allowed shrink-0"
                style={{
                  background: "var(--accent)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.35)",
                  color: "#000",
                }}
              >
                <Send size={17} className="ml-0.5" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="relative flex items-center gap-3">
        {/* Tooltip prompt when closed */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={toggleChat}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full cursor-pointer text-xs font-semibold text-zinc-200 hover:text-white transition-all"
              style={{
                background: "rgba(18, 18, 22, 0.72)",
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
            >
              <Sparkles size={14} className="text-(--accent) animate-pulse" />
              <span>Tanya AI Nabil</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleChat}
          aria-label="Buka AI Assistant Chatbot"
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 group overflow-visible"
          style={{
            background: "rgba(18, 18, 22, 0.78)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.13)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          {/* Hover shimmer overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl pointer-events-none"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-zinc-200 group-hover:text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center"
              >
                <Bot size={26} className="text-(--accent) group-hover:scale-110 transition-transform duration-300" />

                {/* Glowing status online dot */}
                <span className="absolute -top-2.5 -right-2.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-zinc-900"></span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default ChatBot;

