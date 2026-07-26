import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth"; // ✅ TAMBAHKAN
import { auth } from "../lib/firebase";
import { loginWithGoogle, loginWithGithub } from "../lib/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { addDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../lib/firebase";

import google from "../assets/cards/google.svg";
import github from "../assets/cards/github.webp";
import Orb from "../components/ui/Orb";
import { LogOut } from "lucide-react"; // ✅ IMPORT ICON

const Chat = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    console.log("User object saat kirim:", {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      providerData: user.providerData
    });

    try {
      const docRef = await addDoc(collection(db, "messages"), {
        text: message,
        uid: user.uid,
        name: user.displayName || "Anonymous",
        photo: user.photoURL,
        createdAt: serverTimestamp(),
      });

      console.log("Message saved with ID:", docRef.id);
    } catch (error) {
      console.error("Error saving:", error);
    }

    setMessage("");
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <section className="relative px-4 h-full">
      <div
        className={`
      max-w-6xl mx-auto h-full
      grid gap-10 items-center
      ${user ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}
    `}
      >
        {/* CHAT / LOGIN COLUMN */}
        <div
          className={`
        flex justify-center
        ${user ? "col-span-1" : "lg:col-span-7"}
      `}
        >
          <div
            className={`
          w-full relative overflow-hidden
          ${user ? "max-w-4xl" : "max-w-2xl"}
          rounded-3xl
          p-6 sm:p-8
          mt-8 mb-8
        `}
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(24px) saturate(200%)",
              WebkitBackdropFilter: "blur(24px) saturate(200%)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "inset 0 1.5px 0 rgba(255, 255, 255, 0.20), 0 20px 50px rgba(0, 0, 0, 0.4)",
              isolation: "isolate",
            }}
          >
            {/* Liquid Glass top shimmer highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/30 pointer-events-none rounded-t-3xl" />

            {/* HEADER */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
              <div className="text-center mb-6">
                <h1 className="font-[Space_Grotesk] text-3xl font-bold text-zinc-100">Ruang Chat</h1>
                <p className="text-zinc-400 text-sm mt-1">Terbuka untuk berbagi dan diskusi yang santai.</p>
              </div>
            </motion.div>

            {/* AUTH CHECK */}
            {!user ? (
              /* ================= LOGIN ================= */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} className="flex flex-col items-center gap-5 py-10">
                <p className="text-sm text-zinc-400">Silahkan login dulu untuk mengirim pesan</p>

                <button
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl py-3.5 transition-all cursor-pointer group"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.10)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
                >
                  <img src={google} alt="google" width="20" height="20" decoding="async" className="w-5" />
                  <span className="text-sm font-medium text-zinc-100 group-hover:text-white">Lanjutkan dengan Google</span>
                </button>

                <button
                  onClick={loginWithGithub}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl py-3.5 transition-all cursor-pointer group"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.10)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
                >
                  <img src={github} alt="github" width="28" height="28" decoding="async" className="w-7" />
                  <span className="text-sm font-medium text-zinc-100 group-hover:text-white">Lanjutkan dengan Github</span>
                </button>
              </motion.div>
            ) : (
              /* ================= CHAT ================= */
              <>
                {/* USER INFO & LOGOUT — Liquid Glass Bar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between mb-5 p-3.5 rounded-2xl transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.10)",
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.photoURL}
                        alt={`${user.displayName || "User"}'s Profile`}
                        width="40"
                        height="40"
                        decoding="async"
                        className="w-10 h-10 rounded-full border-2 border-(--accent)/40 shadow-sm"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=6366f1&color=fff&bold=true`;
                        }}
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-100 text-sm">{user.displayName}</p>
                      <p className="text-xs text-zinc-400 font-mono">{user.email}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signOut(auth)}
                    className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-red-400 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.10)",
                    }}
                  >
                    <LogOut size={15} />
                    <span className="hidden sm:inline">Logout</span>
                  </motion.button>
                </motion.div>

                {/* CHAT WINDOW — Liquid Glass Box */}
                <div
                  className="rounded-2xl p-4 h-[60vh] sm:h-[45vh] overflow-y-auto flex flex-col gap-4 mb-4 scrollbar-thin scrollbar-thumb-zinc-800"
                  style={{
                    background: "rgba(0, 0, 0, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                      <p className="font-medium text-base">Belum ada pesan 💬</p>
                      <p className="text-xs mt-1 text-zinc-500">Jadilah yang pertama memulai percakapan!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.uid === user.uid;

                      return (
                        <div key={msg.id} className={`flex gap-2.5 ${isMe ? "self-end flex-row-reverse items-end" : "self-start items-end"}`}>
                          {msg.photo && (
                            <img
                              src={msg.photo}
                              alt={`${msg.name}'s Profile`}
                              width="30"
                              height="30"
                              decoding="async"
                              className="w-7 h-7 rounded-full border border-white/15"
                            />
                          )}

                          <div
                            className="px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed"
                            style={
                              isMe
                                ? {
                                    background: "var(--accent)",
                                    color: "#000",
                                    fontWeight: 600,
                                    borderBottomRightRadius: "4px",
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
                                  }
                                : {
                                    background: "rgba(255, 255, 255, 0.08)",
                                    color: "rgba(228, 228, 231, 1)",
                                    border: "1px solid rgba(255, 255, 255, 0.10)",
                                    borderBottomLeftRadius: "4px",
                                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                                  }
                            }
                          >
                            {!isMe && <p className="text-[11px] text-(--accent) font-semibold mb-1 opacity-90">{msg.name}</p>}
                            <p className="whitespace-pre-wrap break-all">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* INPUT BAR */}
                <div className="flex gap-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ketik Pesan..."
                    className="flex-1 rounded-2xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 resize-none focus:outline-none transition-all"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.10)",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.07)",
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    type="button"
                    className="cursor-pointer rounded-2xl px-6 font-bold text-sm flex items-center justify-center transition-all shrink-0"
                    style={{
                      background: "var(--accent)",
                      color: "#000",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 14px rgba(0,0,0,0.3)",
                    }}
                  >
                    Kirim
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ORB (ONLY WHEN NOT LOGIN) */}
        {!user && (
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm lg:max-w-md">
              <Orb />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Chat;