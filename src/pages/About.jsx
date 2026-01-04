import TextType from "../components/text/TextType";
import Lanyard from "../components/ui/Lanyard";
import logo_teknokrat from "../assets/cards/logo_teknokrat.png";
import logo_me from "../assets/cards/logo_me.png";
import google_maps from "../assets/cards/google_maps.png";
import BlurText from "../components/ui/BlurText";
import SplitText from "../components/ui/SplitText";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

// import myFoto from "../assets/my_foto.jpeg";

const socialLinks = [
  {
    name: "linkedin",
    href: "https://www.linkedin.com/in/muhammad-sajid-4752742a0/",
  },
  {
    name: "github",
    href: "https://github.com/Sanzzyy",
  },
  {
    name: "instagram",
    href: "https://www.instagram.com/syzen.web/",
  },
  {
    name: "tiktok",
    href: "https://www.tiktok.com/@syzen.web",
  },
];

const About = ({ isReady }) => {
  const [showTyping, setShowTyping] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showLanyard, setShowLanyard] = useState(false);

  useEffect(() => {
    if (!isReady) {
      setShowTyping(false);
      setShowDescription(false);
      setShowSocial(false);
      setShowLanyard(false);
    }
  }, [isReady]);

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

  useEffect(() => {
    if (showTyping) {
      const t = setTimeout(() => setShowDescription(true), 300);
      return () => clearTimeout(t);
    }
  }, [showTyping]);

  useEffect(() => {
    if (showSocial) {
      const t = setTimeout(() => setShowLanyard(true), 400);
      return () => clearTimeout(t);
    }
  }, [showSocial]);

  return (
    <section className="relative overflow-hidden">
      <div className="relative inset-0 z-10 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          {/* ================= HERO ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* TEXT */}
            <div className="space-y-3 pt-3 lg:pt-28 2xl:pt-44">
              {/* HEADLINE */}
              {isReady && (
                <BlurText text="Hi 👋, I'm Sajid Izzulhaq" className="font-[Space_Grotesk] text-4xl lg:text-5xl font-bold leading-tight" animateBy="words" delay={100} direction="top" onAnimationComplete={() => setShowTyping(true)} />
              )}

              {/* TYPING */}
              {showTyping && <TextType text={["Fullstack Developer", "Content Creator"]} typingSpeed={35} deletingSpeed={25} pauseDuration={1200} cursorCharacter="_" className="text-(--accent) tracking-widest" />}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={showDescription ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onAnimationComplete={() => {
                  if (showDescription) {
                    setTimeout(() => setShowSocial(true), 500);
                  }
                }}
              >
                {showDescription && (
                  <SplitText
                    text="I am a university student actively improving my skills in web development, focusing on building clean, modern, and user-friendly applications using React, Tailwind CSS, and backend fundamentals."
                    className="text-zinc-300 text-base leading-relaxed max-w-xl text-start"
                    animateBy="words"
                  />
                )}
              </motion.div>

              {/* SOCIAL */}
              <div className="flex items-center gap-4 pt-2 overflow-hidden">
                {showSocial && (
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
                )}
              </div>
            </div>

            {/* LANYARD */}

            <div className="h-[500px] 2xl:h-[620px]">
              {showLanyard && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                  <Lanyard position={[0, 0, 18]} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ================= BIODATA ================= */}
      <div className="p-6 mt-0 md:mt-32 lg:mt-0">
        <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <i className="ri-information-line text-(--accent) text-2xl" />
          Biodata
        </motion.h3>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={gridContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {/* NAME */}
          <motion.a href="https://www.linkedin.com/in/muhammad-sajid-4752742a0/" variants={cardItem} whileHover={{ y: -2 }}>
            <div className="flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-(--accent) transition">
              <img src={logo_me} alt="Profile" className="w-12 h-12 object-contain" />
              <div>
                <p className="text-sm text-zinc-400">Name</p>
                <p className="font-medium">Sajid Izzulhaq</p>
              </div>
            </div>
          </motion.a>

          {/* EDUCATION */}
          <motion.a href="https://teknokrat.ac.id/" variants={cardItem} whileHover={{ y: -2 }}>
            <div className="flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-(--accent) transition">
              <img src={logo_teknokrat} alt="University" className="w-12 h-12 object-contain" />
              <div>
                <p className="text-sm text-zinc-400">Education</p>
                <p className="font-medium">University Teknokrat</p>
              </div>
            </div>
          </motion.a>

          {/* LOCATION */}
          <motion.div variants={cardItem} whileHover={{ y: -2 }}>
            <div className="flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-(--accent) transition">
              <img src={google_maps} alt="Location" className="w-10 h-10 object-contain" />
              <div>
                <p className="text-sm text-zinc-400">Location</p>
                <p className="font-medium">Bandar Lampung</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ================= EXPERIENCE ================= */}
      <div className="p-6">
        <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <i className="ri-organization-chart text-(--accent) text-2xl" />
          Experience
        </motion.h3>

        <motion.div className="space-y-4" variants={gridContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
            {
              title: "Frontend Developer (Self Learning)",
              desc: "Learning and building responsive web interfaces using React, Tailwind CSS, and modern JavaScript.",
            },
            {
              title: "Personal Web Projects",
              desc: "Developing personal portfolio websites, landing pages, and interactive components.",
            },
            {
              title: "UI & Layout Practice",
              desc: "Designing clean layouts, typography systems, and responsive grids using Tailwind CSS and Figma references.",
            },
            {
              title: "Laravel CRUD & Authentication System",
              desc: "Building web applications with CRUD, authentication, and role-based access control.",
            },
          ].map((item, i) => (
            <motion.div key={i} variants={cardItem} whileHover={{ y: -2 }} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-(--accent) transition">
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-zinc-400 mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
