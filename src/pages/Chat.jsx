import { motion } from "motion/react";
import { useEffect, useState } from "react";
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

  return (
    <section className="relative flex items-center justify-center px-4 h-full">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-2xl bg-zinc-900/80 border border-zinc-800 rounded-2xl backdrop-blur p-8 mt-8 mb-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
              <div className="text-center mb-6">
                <h1 className="font-[Space_Grotesk] text-3xl font-bold">Chat Room</h1>
                <p className="text-zinc-400 text-sm mt-1">Open for sharing or a friendly chat</p>
              </div>
            </motion.div>

            {/* AUTH CHECK */}

            {!user ? (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} className="flex flex-col items-center gap-5 py-10">
                <p className="text-sm text-zinc-400">Please login to start chatting</p>

                {/* Google */}
                <button
                  onClick={loginWithGoogle}
                  className="
              w-full flex items-center justify-center gap-3
              rounded-xl border border-zinc-700
              py-3
              bg-zinc-900/60
              hover:bg-zinc-800
              transition-all duration-200
              "
                >
                  <img src={google} alt="logo_google" className="w-5" />
                  <span className="text-sm font-medium text-zinc-200">Continue with Google</span>
                </button>

                {/* GitHub */}
                <button
                  onClick={loginWithGithub}
                  className="
              w-full flex items-center justify-center gap-3
              rounded-xl border border-zinc-700
              py-3
              bg-zinc-900/60
              hover:bg-zinc-800
              transition-all duration-200
              "
                >
                  <img src={github} alt="logo_github" className="w-7" />
                  <span className="text-sm font-medium text-zinc-200">Continue with GitHub</span>
                </button>
              </motion.div>
            ) : (
              <>
                {/* Chat Window */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 h-96 overflow-y-auto flex flex-col gap-4 mb-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 px-6">
                      <p className="text-sm sm:text-base font-medium">No messages yet 💬</p>
                      <p className="text-xs sm:text-sm mt-1 opacity-80">Start the conversation by sending your first message.</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.uid === user.uid;

                      return (
                        <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "self-end flex-row-reverse" : "self-start"}`}>
                          {/* Avatar */}
                          {msg.photo && <img src={msg.photo} alt={msg.name} className="w-7 h-7 rounded-full object-cover shrink-0" />}

                          {/* Bubble */}
                          <div
                            className={`
                          relative px-4 py-2.5 rounded-2xl
                          text-sm sm:text-base
                          leading-relaxed
                          max-w-[85%] sm:max-w-[70%]
                          shadow-md
                          ${isMe ? "bg-[var(--accent)] text-black rounded-br-md" : "bg-zinc-800 text-zinc-100 rounded-bl-md"}
                          `}
                          >
                            {!isMe && <p className="text-xs opacity-70 mb-1 select-none">{msg.name}</p>}

                            <p className="whitespace-pre-wrap break-all">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Area */}
                <form className="space-y-3">
                  <div className="flex gap-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm
                  focus:outline-none focus:border-[var(--accent)] transition resize-none"
                    />

                    <button
                      type="button"
                      onClick={handleSend}
                      className="rounded-xl bg-zinc-800 text-white font-semibold px-5  
                  hover:opacity-90 transition hover:cursor-pointer hover:text-accent"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-sm lg:max-w-md">
            <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
