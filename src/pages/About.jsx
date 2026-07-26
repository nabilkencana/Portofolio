import TextType from "../components/text/TextType";
import logo_telkom from "../assets/cards/logo_telkom.webp";
import logo_me from "../assets/cards/logo_me.webp";
import google_maps from "../assets/cards/google_maps.webp";
import BlurText from "../components/ui/BlurText";
import SplitText from "../components/ui/SplitText";
import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "motion/react";

const Lanyard = lazy(() => import("../components/ui/Lanyard"));

// import myFoto from "../assets/my_foto.jpeg";

const socialLinks = [
  {
    name: "linkedin",
    href: "https://www.linkedin.com/in/nabilkencana/",
  },
  {
    name: "github",
    href: "https://github.com/nabilkencana",
  },
  {
    name: "instagram",
    href: "https://www.instagram.com/nabill.anwr/",
  },
  {
    name: "tiktok",
    href: "https://www.tiktok.com/@nabilkencana20",
  },
];

const About = ({ isReady }) => {
  const [showTyping, setShowTyping] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showSocial, setShowSocial] = useState(true);
  const [showLanyard, setShowLanyard] = useState(true);
  const [showAllExp, setShowAllExp] = useState(false);

  const sectionTitle = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const gridContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.9,
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative inset-0 z-10 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          {/* ================= HERO ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* TEXT */}
            <div className="space-y-3 pt-2 lg:pt-16">
              {/* HEADLINE */}
              <BlurText text="Hi 👋, I'm Nabil Kencana" className="font-[Space_Grotesk] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" animateBy="words" delay={100} direction="top" />

              {/* TYPING */}
              <TextType text={["Junior Fullstack Developer", "Junior Mobile App Developer"]} typingSpeed={35} deletingSpeed={25} pauseDuration={1200} cursorCharacter="_" className="text-(--accent) tracking-widest text-sm sm:text-base font-semibold" />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <SplitText
                  text="Saya adalah siswa SMK Telkom Malang yang sedang aktif mengembangkan kemampuan di bidang web development, dengan fokus pada pembuatan aplikasi yang modern, bersih, dan mudah digunakan menggunakan React, Tailwind CSS, serta dasar-dasar backend."
                  className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl text-start"
                  animateBy="words"
                />
              </motion.div>

              {/* SOCIAL */}
              <div className="flex items-center gap-4 pt-2 overflow-hidden">
                <motion.div className="flex items-center gap-4 pt-2 overflow-hidden" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                  <SplitText text="Follow me" className="text-zinc-400 text-sm" animateBy="chars" />

                  <motion.div
                    className="flex items-center gap-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.12,
                          delayChildren: 0.2,
                        },
                      },
                    }}
                  >
                    {socialLinks.map((item) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Profil ${item.name} Nabil Kencana`}
                        initial={{ opacity: 0, scale: 0.85, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        viewport={{ once: true }}
                        style={{ willChange: "transform" }}
                        className="w-10 h-10 flex items-center justify-center rounded-full
             bg-zinc-800 hover:bg-(--accent) hover:text-black transition"
                      >
                        <i className={`ri-${item.name}-fill text-lg`} />
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* LANYARD */}
            <div className="h-[480px] sm:h-[520px] lg:h-[500px] w-full relative my-2 lg:my-0">
              {showLanyard && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full h-full">
                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-zinc-500 font-medium">Memuat Interactive Card...</div>}>
                    <Lanyard position={[0, 0, 13]} fov={22} />
                  </Suspense>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ================= BIODATA ================= */}
      <div className="p-6 mt-8 md:mt-24 lg:mt-0">
        <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <i className="ri-information-line text-(--accent) text-2xl" />
          Biodata
        </motion.h3>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={gridContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {/* NAME */}
          <motion.a href="https://www.linkedin.com/in/nabilkencana/" variants={cardItem} whileHover={{ y: -3 }} target="_blank" rel="noopener noreferrer">
            <div
              className="flex items-center gap-4 p-5 rounded-2xl transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 20px rgba(0,0,0,0.2)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <img src={logo_me} alt="Profile Icon" width="48" height="48" decoding="async" className="w-12 h-12 object-contain" />
              <div>
                <p className="text-sm text-zinc-400">Nama</p>
                <p className="font-medium text-zinc-100">Nabil Kencana</p>
              </div>
            </div>
          </motion.a>

          {/* EDUCATION */}
          <motion.a href="https://www.smktelkom-mlg.sch.id/" variants={cardItem} whileHover={{ y: -3 }} target="_blank" rel="noopener noreferrer">
            <div
              className="flex items-center gap-4 p-5 rounded-2xl transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 20px rgba(0,0,0,0.2)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <img src={logo_telkom} alt="SMK Telkom Malang Logo" width="48" height="48" decoding="async" className="w-12 h-12 object-contain" />
              <div>
                <p className="text-sm text-zinc-400">Pendidikan</p>
                <p className="font-medium text-zinc-100">SMK Telkom Malang</p>
              </div>
            </div>
          </motion.a>

          {/* LOCATION */}
          <motion.a href="https://maps.google.com/?q=Malang" target="_blank" rel="noopener noreferrer" variants={cardItem} whileHover={{ y: -3 }}>
            <div
              className="flex items-center gap-4 p-5 rounded-2xl transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 20px rgba(0,0,0,0.2)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <img src={google_maps} alt="Malang Map Icon" width="40" height="40" decoding="async" className="w-10 h-10 object-contain" />
              <div>
                <p className="text-sm text-zinc-400">Lokasi</p>
                <p className="font-medium text-zinc-100">Malang</p>
              </div>
            </div>
          </motion.a>
        </motion.div>
      </div>

      {/* ================= EXPERIENCE ================= */}
      <div className="p-6">
        <motion.h3
          className="flex items-center gap-3 text-xl font-semibold mb-6"
          variants={sectionTitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <i className="ri-organization-chart text-(--accent) text-2xl" />
          Pengalaman
        </motion.h3>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {experiences
            .slice(0, showAllExp ? experiences.length : 3)
            .map((item, i) => (
              <motion.div
                key={i}
                variants={cardItem}
                whileHover={{ y: -3 }}
                className="p-4 sm:p-5 rounded-2xl transition-all flex flex-col justify-between"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 24px rgba(0,0,0,0.2)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-sm sm:text-base text-zinc-100">{item.title}</h4>
                    <span
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full text-(--accent) shrink-0"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      }}
                    >
                      {item.role}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] px-2 py-0.5 rounded-md text-zinc-300 font-mono"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* Toggle Show More on Mobile */}
        <div className="mt-5 text-center">
          <button
            onClick={() => setShowAllExp(!showAllExp)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-200 border border-white/15 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer shadow-md"
          >
            <span>{showAllExp ? "Tampilkan Lebih Sedikit" : `Lihat Semua Pengalaman (${experiences.length})`}</span>
            <i className={`ri-arrow-${showAllExp ? "up" : "down"}-s-line text-sm`} />
          </button>
        </div>
      </div>
    </section>
  );
};

const experiences = [
  {
    role: "Fullstack & Multi-Platform",
    title: "Ekosistem Aplikasi Terintegrasi",
    desc: "Merancang & membangun ekosistem aplikasi terintegrasi yang mencakup Web Frontend (React/TS), Backend API (NestJS), Mobile App (Flutter), dan Admin Dashboard.",
    tags: ["React", "NestJS", "Flutter", "TypeScript"],
  },
  {
    role: "Backend Engineering",
    title: "RESTful API & Service (Golang & NestJS)",
    desc: "Mengembangkan backend service berkinerja tinggi menggunakan Go (Golang) dan NestJS, mencakup manajemen database, sistem autentikasi, dan deployment cloud.",
    tags: ["Golang", "NestJS", "PostgreSQL", "Vercel"],
  },
  {
    role: "Frontend Development",
    title: "Aplikasi Web Interaktif & Platform Digital",
    desc: "Membangun antarmuka web modern & responsif menggunakan React, Next.js, dan Tailwind CSS dengan arsitektur komponen yang bersih dan performansi optimal.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    role: "Mobile Development",
    title: "Aplikasi Mobile Lintas Platform",
    desc: "Mengembangkan aplikasi mobile Android/iOS menggunakan Flutter dengan manajemen status yang efisien serta integrasi Supabase & SQLite.",
    tags: ["Flutter", "Dart", "Supabase", "SQLite"],
  },
  {
    role: "AI & Smart Systems",
    title: "Solusi Digital Berbasis AI & Computer Vision",
    desc: "Mengintegrasikan fitur cerdas berbasis AI ke dalam solusi web dan mobile, mencakup sistem analisis data serta pendeteksian berbasis Computer Vision.",
    tags: ["Python", "AI Integration", "React", "Flutter"],
  },
];

export default About;
