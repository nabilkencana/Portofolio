 import React from "react";
import gmail from "../assets/cards/gmail.webp";
import instagram from "../assets/cards/instagram.webp";
import github from "../assets/cards/github.webp";
import tiktok from "../assets/cards/tiktok.webp";
import { motion } from "motion/react";

const socials = [
  {
    name: "Gmail",
    value: "nabilkencana20@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&to=nabilkencana20@gmail.com&su=Hello&body=Halo Nabil",
    icon: gmail,
  },
  {
    name: "Instagram",
    value: "@nabill.anwr",
    href: "https://www.instagram.com/nabill.anwr/",
    icon: instagram,
  },
  {
    name: "GitHub",
    value: "https://github.com/nabilkencana",
    href: "https://github.com/nabilkencana",
    icon: github,
  },
  {
    name: "TikTok",
    value: "@nabilkencana20",
    href: "https://www.tiktok.com/@nabilkencana20",
    icon: tiktok,
  },
];

const Contact = () => {
  return (
    <section className="relative px-4 py-20 h-full flex items-center justify-center">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="mb-12 text-center">
            <h1 className="font-[Space_Grotesk] text-4xl font-bold">Hubungi Saya</h1>
            <p className="mt-3 text-zinc-400">Silakan hubungi saya melalui platform berikut</p>
          </div>
        </motion.div>

        {/* GRID */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {socials.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 cursor-pointer border border-white/10 hover:border-(--accent)/40 hover:shadow-xl"
              style={{
                background: "rgba(18, 18, 24, 0.45)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 32px rgba(0, 0, 0, 0.35)",
              }}
            >
              {/* Liquid Glass top shimmer highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-white/20 pointer-events-none z-20 rounded-t-3xl" />

              {/* Accent glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 0%, rgba(var(--accent-rgb), 0.25) 0%, transparent 75%)",
                }}
              />

              <div className="relative z-10 flex items-center gap-4">
                {/* Icon — Glass Tile */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: "rgba(255, 255, 255, 0.07)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <img src={item.icon} alt={`${item.name} Logo`} loading="lazy" decoding="async" className="w-6 h-6 object-contain" />
                </div>

                {/* Text */}
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-zinc-100 text-base group-hover:text-white transition-colors">{item.name}</p>
                  <p className="mt-0.5 text-xs sm:text-sm text-zinc-300 font-mono truncate">{item.value}</p>
                </div>

                {/* Arrow */}
                <i className="ri-arrow-right-up-line text-lg text-zinc-400 group-hover:text-(--accent) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
