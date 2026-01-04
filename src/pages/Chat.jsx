import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { loginWithGoogle, loginWithGithub } from "../lib/auth";
// import { sendMessage } from "../lib/chat";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { addDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../lib/firebase";

import google from "../assets/cards/google.svg";
import github from "../assets/cards/github.png";
import Orb from "../components/orb/Orb";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      uid: user.uid,
      name: user.displayName, // ✅ INI
      photo: user.photoURL,
      createdAt: serverTimestamp(),
    });

    setMessage(""); // textarea langsung kosong
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
          w-full 
          ${user ? "max-w-4xl" : "max-w-2xl"}
          bg-zinc-900/80
          border border-zinc-800
          rounded-2xl
          backdrop-blur
          p-6 sm:p-8
          mt-8 mb-8
        `}
          >
            {/* HEADER */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
              <div className="text-center mb-6">
                <h1 className="font-[Space_Grotesk] text-3xl font-bold">Chat Room</h1>
                <p className="text-zinc-400 text-sm mt-1">Open for sharing or a friendly chat</p>
              </div>
            </motion.div>

            {/* AUTH CHECK */}
            {!user ? (
              /* ================= LOGIN ================= */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} className="flex flex-col items-center gap-5 py-10">
                <p className="text-sm text-zinc-400">Please login to start chatting</p>

                <button
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-3
              rounded-xl border border-zinc-700 py-3
              bg-zinc-900/60 hover:bg-zinc-800 transition"
                >
                  <img src={google} alt="google" className="w-5" />
                  <span className="text-sm font-medium text-zinc-200">Continue with Google</span>
                </button>

                <button
                  onClick={loginWithGithub}
                  className="w-full flex items-center justify-center gap-3
              rounded-xl border border-zinc-700 py-3
              bg-zinc-900/60 hover:bg-zinc-800 transition"
                >
                  <img src={github} alt="github" className="w-7" />
                  <span className="text-sm font-medium text-zinc-200">Continue with GitHub</span>
                </button>
              </motion.div>
            ) : (
              /* ================= CHAT ================= */
              <>
                {/* CHAT WINDOW */}
                <div
                  className="bg-zinc-950 border border-red-500 rounded-2xl p-4
              h-[60vh] sm:h-[43vh] overflow-y-auto flex flex-col gap-4 mb-4"
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                      <p className="font-medium">No messages yet 💬</p>
                      <p className="text-sm mt-1 opacity-80">Start the conversation</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.uid === user.uid;

                      return (
                        <div key={msg.id} className={`flex gap-2 ${isMe ? "self-end flex-row-reverse items-end" : "self-start "}`}>
                          {msg.photo && <img src={msg.photo} alt={msg.name} className="w-7 h-7 rounded-full " />}

                          <div
                            className={`
                          px-4 py-2.5 rounded-2xl max-w-[90%]
                          ${isMe ? "bg-[var(--accent)] text-black rounded-br-md" : "bg-zinc-800 text-zinc-100 rounded-bl-md"}
                        `}
                          >
                            {!isMe && <p className="text-xs opacity-70 mb-1">{msg.name}</p>}
                            <p className="whitespace-pre-wrap break-all">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className="flex gap-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800
                px-4 py-2.5 text-sm resize-none focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    type="button"
                    className="rounded-xl bg-zinc-800 px-5 font-semibold
                hover:opacity-90 transition"
                  >
                    Send
                  </button>
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
