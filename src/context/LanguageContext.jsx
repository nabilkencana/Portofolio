import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  id: {
    nav: {
      tentang: "Tentang",
      galeri: "Galeri",
      keahlian: "Keahlian",
      proyek: "Proyek",
      pencapaian: "Pencapaian",
      kontak: "Kontak",
      chat: "Chat",
    },
    theme: "TEMA",
    themeAria: "Pilih warna tema",
    sidebarAvatarAria: "Navigasi ke halaman Tentang",
    about: {
      greeting: "Hi 👋, I'm Nabil Kencana",
      roles: ["Junior Fullstack Developer", "Junior Mobile App Developer"],
      bio: "Saya adalah siswa SMK Telkom Malang yang sedang aktif mengembangkan kemampuan di bidang web development, dengan fokus pada pembuatan aplikasi yang modern, bersih, dan mudah digunakan menggunakan React, Tailwind CSS, serta dasar-dasar backend.",
      follow: "Follow me",
      lanyardLoading: "Memuat Interactive Card...",
      biodata: "Biodata",
      nameLabel: "Nama",
      educationLabel: "Pendidikan",
      locationLabel: "Lokasi",
      experience: "Pengalaman",
      showLess: "Tampilkan Lebih Sedikit",
      showAll: "Lihat Semua Pengalaman",
      experiences: [
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
      ],
    },
    projects: {
      title: "Proyek Saya",
      subtitle: "Beberapa proyek yang telah saya bangun menggunakan teknologi web modern.",
      addBtn: "Tambah Proyek",
      openBtn: "Buka Proyek",
      closeAria: "Tutup detail proyek",
      loading: "Memuat Halaman...",
    },
    gallery: {
      title: "Galeri Saya",
      subtitle: "Momen dari perjalanan saya — ngoding, acara, hobi, dan kehidupan sehari-hari",
      addBtn: "Tambah Foto",
      connecting: "Menghubungkan ke galeri...",
      emptyTitle: "Galeri Kosong",
      emptyDesc: "Tidak ada foto yang tersedia untuk ditampilkan.",
      dragNav: "Drag untuk navigasi",
      swipeNav: "Swipe untuk navigasi",
      touchSwipeNav: "Touch & swipe untuk navigasi",
    },
    skills: {
      title: "Keahlian Saya",
      subtitle: "Teknologi dan tools yang saya gunakan untuk membangun aplikasi web modern.",
    },
    achievements: {
      title: "Pencapaian",
      subtitle: "Beberapa sertifikasi dan pencapaian pembelajaran yang mencerminkan perkembangan saya dalam teknologi dan pemecahan masalah.",
      addBtn: "Tambah",
      closeAria: "Tutup detail pencapaian",
      items: [
        {
          id: "ach_1",
          title: "Golden Ticket",
          description: "Sertifikat Dari Kejuaraan Lomba INOTEK UNISKA.",
          tech: ["Aplikasi", "Ide Bisnis"],
        },
        {
          id: "ach_2",
          title: "Juara 2 INOTEK",
          description: "Juara 2 INOTEK Tingkat Nasional yang diselenggarakan UNISKA.",
          tech: ["INOTEK", "Figma"],
        },
        {
          id: "ach_3",
          title: "Juara 3 Web Development",
          description: "Juara 3 Web Development Tingkat Nasional yang diselenggarakan oleh IITC Purwokerto.",
          tech: ["Programing", "Web Development"],
        },
        {
          id: "ach_4",
          title: "Sertifikasi AMD",
          description: "Sertifikat sebagai peserta Talkshow AMD.",
          tech: ["Classroom"],
        },
        {
          id: "ach_5",
          title: "Sertifikasi Cyber",
          description: "Sertifikasi pelatihan Cyber Security Awareness.",
          tech: ["Cyber Security Fundamental"],
        },
      ],
    },
    contact: {
      title: "Hubungi Saya",
      subtitle: "Silakan hubungi saya melalui platform berikut",
    },
    chatPage: {
      title: "Ruang Chat",
      subtitle: "Terbuka untuk berbagi dan diskusi yang santai.",
      loginPrompt: "Silahkan login dulu untuk mengirim pesan",
      loginGoogle: "Lanjutkan dengan Google",
      loginGithub: "Lanjutkan dengan GitHub",
      logout: "Logout",
      noMessages: "Belum ada pesan 💬",
      beFirst: "Jadilah yang pertama memulai percakapan!",
      placeholder: "Ketik Pesan...",
      send: "Kirim",
    },
    bot: {
      greeting: "Halo! Saya AI Nabil. Ada yang bisa saya bantu tentang portofolio Nabil?",
      headerTitle: "Nabil AI Assistant",
      poweredBy: "Powered by Gemini AI",
      clearTooltip: "Hapus Percakapan",
      clearAria: "Hapus percakapan",
      closeAria: "Tutup chatbot",
      thinking: "Nabil AI sedang berpikir",
      suggested: [
        "Siapa Nabil?",
        "Apa saja proyeknya?",
        "Apa keahliannya?",
        "Kontak Nabil"
      ],
      placeholder: "Tanya tentang skill, repo, atau proyek...",
      sendAria: "Kirim pesan",
      triggerTooltip: "Tanya AI Nabil",
      triggerAria: "Buka AI Assistant Chatbot",
    },
  },
  en: {
    nav: {
      tentang: "About",
      galeri: "Gallery",
      keahlian: "Skills",
      proyek: "Projects",
      pencapaian: "Achievements",
      kontak: "Contact",
      chat: "Chat",
    },
    theme: "THEME",
    themeAria: "Select theme color",
    sidebarAvatarAria: "Navigate to About page",
    about: {
      greeting: "Hi 👋, I'm Nabil Kencana",
      roles: ["Junior Fullstack Developer", "Junior Mobile App Developer"],
      bio: "I am a Telkom Malang Vocational High School student actively developing my skills in web development, focusing on building modern, clean, and user-friendly applications using React, Tailwind CSS, and backend fundamentals.",
      follow: "Follow me",
      lanyardLoading: "Loading Interactive Card...",
      biodata: "Biodata",
      nameLabel: "Name",
      educationLabel: "Education",
      locationLabel: "Location",
      experience: "Experience",
      showLess: "Show Less",
      showAll: "View All Experiences",
      experiences: [
        {
          role: "Fullstack & Multi-Platform",
          title: "Integrated Application Ecosystem",
          desc: "Designing & building integrated app ecosystems including Web Frontend (React/TS), Backend API (NestJS), Mobile App (Flutter), and Admin Dashboard.",
          tags: ["React", "NestJS", "Flutter", "TypeScript"],
        },
        {
          role: "Backend Engineering",
          title: "RESTful API & Service (Golang & NestJS)",
          desc: "Developing high-performance backend services using Go (Golang) and NestJS, covering database management, authentication systems, and cloud deployment.",
          tags: ["Golang", "NestJS", "PostgreSQL", "Vercel"],
        },
        {
          role: "Frontend Development",
          title: "Interactive Web Apps & Digital Platforms",
          desc: "Building modern & responsive web interfaces using React, Next.js, and Tailwind CSS with clean component architecture and optimal performance.",
          tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        },
        {
          role: "Mobile Development",
          title: "Cross-Platform Mobile Applications",
          desc: "Developing Android/iOS mobile apps using Flutter with efficient state management and Supabase & SQLite integration.",
          tags: ["Flutter", "Dart", "Supabase", "SQLite"],
        },
        {
          role: "AI & Smart Systems",
          title: "AI-Powered & Computer Vision Solutions",
          desc: "Integrating intelligent AI features into web and mobile solutions, including data analytics systems and Computer Vision detection.",
          tags: ["Python", "AI Integration", "React", "Flutter"],
        },
      ],
    },
    projects: {
      title: "My Projects",
      subtitle: "Some of the projects I have built using modern web technologies.",
      addBtn: "Add Project",
      openBtn: "Open Project",
      closeAria: "Close project details",
      loading: "Loading Page...",
    },
    gallery: {
      title: "My Gallery",
      subtitle: "Moments from my journey — coding, events, hobbies, and daily life",
      addBtn: "Add Photo",
      connecting: "Connecting to gallery...",
      emptyTitle: "Gallery Empty",
      emptyDesc: "No photos available to display.",
      dragNav: "Drag to navigate",
      swipeNav: "Swipe to navigate",
      touchSwipeNav: "Touch & swipe to navigate",
    },
    skills: {
      title: "My Skills",
      subtitle: "Technologies and tools I use to build modern web applications.",
    },
    achievements: {
      title: "Achievements",
      subtitle: "Certifications and learning achievements reflecting my growth in technology and problem solving.",
      addBtn: "Add",
      closeAria: "Close achievement details",
      items: [
        {
          id: "ach_1",
          title: "Golden Ticket",
          description: "Certificate from UNISKA INOTEK Competition.",
          tech: ["Application", "Business Idea"],
        },
        {
          id: "ach_2",
          title: "2nd Winner INOTEK",
          description: "2nd Place National Level INOTEK held by UNISKA.",
          tech: ["INOTEK", "Figma"],
        },
        {
          id: "ach_3",
          title: "3rd Winner Web Development",
          description: "3rd Place National Level Web Development held by IITC Purwokerto.",
          tech: ["Programming", "Web Development"],
        },
        {
          id: "ach_4",
          title: "AMD Certification",
          description: "Certificate as AMD Talkshow participant.",
          tech: ["Classroom"],
        },
        {
          id: "ach_5",
          title: "Cyber Security Certification",
          description: "Cyber Security Awareness training certification.",
          tech: ["Cyber Security Fundamental"],
        },
      ],
    },
    contact: {
      title: "Contact Me",
      subtitle: "Feel free to reach out to me on the following platforms",
    },
    chatPage: {
      title: "Chat Room",
      subtitle: "Open for sharing and casual discussions.",
      loginPrompt: "Please login first to send a message",
      loginGoogle: "Continue with Google",
      loginGithub: "Continue with GitHub",
      logout: "Logout",
      noMessages: "No messages yet 💬",
      beFirst: "Be the first to start a conversation!",
      placeholder: "Type a message...",
      send: "Send",
    },
    bot: {
      greeting: "Hello! I'm Nabil's AI. How can I help you regarding Nabil's portfolio?",
      headerTitle: "Nabil AI Assistant",
      poweredBy: "Powered by Gemini AI",
      clearTooltip: "Clear Conversation",
      clearAria: "Clear conversation",
      closeAria: "Close chatbot",
      thinking: "Nabil AI is thinking",
      suggested: [
        "Who is Nabil?",
        "What are his projects?",
        "What are his skills?",
        "Contact Nabil"
      ],
      placeholder: "Ask about skills, repos, or projects...",
      sendAria: "Send message",
      triggerTooltip: "Ask Nabil AI",
      triggerAria: "Open AI Assistant Chatbot",
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("app_lang");
    return saved === "en" ? "en" : "id";
  });

  useEffect(() => {
    localStorage.setItem("app_lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "id" ? "en" : "id"));
  };

  const t = (path) => {
    const keys = path.split(".");
    let current = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to Indonesian if key missing in current language
        let fallback = translations.id;
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
