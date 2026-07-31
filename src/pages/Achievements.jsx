import React, { useState, useEffect } from "react";
import SpotlightCard from "../components/spotlight_card/SpotlightCard";
import { achievementsData } from "../data/achievementsData";
import { getMergedAchievements } from "../lib/adminStore";
import { isAdminLoggedIn } from "../lib/adminAuth";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Achievements = () => {
  const { t, language } = useLanguage();
  // Show static data immediately — Firestore merge happens silently in background
  const [allAchievements, setAllAchievements] = useState(achievementsData);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [adminMode, setAdminMode] = useState(isAdminLoggedIn());

  useEffect(() => {
    const merge = () =>
      getMergedAchievements(achievementsData).then((data) => {
        setAllAchievements(data);
        setAdminMode(isAdminLoggedIn());
      });
    merge();
    window.addEventListener("adminDataUpdated", merge);
    return () => window.removeEventListener("adminDataUpdated", merge);
  }, []);

  const translatedItems = t("achievements.items") || achievementsData;

  const displayAchievements = allAchievements.map((item) => {
    const matched = translatedItems.find((tItem) => tItem.id === item.id);
    if (matched) {
      return {
        ...item,
        title: matched.title || item.title,
        description: matched.description || item.description,
        tech: matched.tech || item.tech,
      };
    }
    return item;
  });

  return (
    <section className="space-y-3 relative">
      {/* Header */}
      <div>
        <div className="p-6 max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-[Space_Grotesk] text-4xl font-bold">{t("achievements.title")}</h1>
              <p className="text-zinc-400 mt-3 leading-relaxed">{t("achievements.subtitle")}</p>
            </div>
            {adminMode && (
              <button
                onClick={() => window.openAdminWithTab?.("achievement")}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/60
                  text-accent transition-all duration-200 mt-1"
              >
                <Plus size={16} />
                {t("achievements.addBtn")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid — no entrance animation, data is already in useState */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-6">
        {displayAchievements.map((item, index) => (
          <motion.div
            key={item.id || index}
            whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
            onClick={() => setSelectedAchievement(item)}
            className="cursor-pointer group h-full"
          >
            <SpotlightCard
              spotlightColor="rgba(var(--accent-rgb), 0.2)"
              className="rounded-3xl overflow-hidden h-full border border-white/10 hover:border-accent/40 transition-all duration-300 group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)] relative"
              style={{
                background: "rgba(18, 18, 24, 0.45)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 32px rgba(0, 0, 0, 0.35)",
              }}
            >
              {/* Liquid Glass top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-white/20 z-20 pointer-events-none rounded-t-3xl" />

              {/* IMAGE CONTAINER */}
              <div className="relative w-full overflow-hidden aspect-video bg-black/30 backdrop-blur-xs border-b border-white/10">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-3 flex flex-col justify-between flex-1">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-accent group-hover:translate-x-1 transition-transform duration-200 line-clamp-1">{item.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(item.tech) ? item.tech : []).map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md text-zinc-300 font-medium"
                        style={{
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.10)",
                          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.07)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3 font-normal">{item.description}</p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Modal Popup — Liquid Glass */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-md"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] max-h-[90vh] flex flex-col font-sans"
              style={{
                background: "rgba(18, 18, 24, 0.45)",
                backdropFilter: "blur(36px) saturate(200%)",
                WebkitBackdropFilter: "blur(36px) saturate(200%)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "inset 0 1.5px 0 rgba(255, 255, 255, 0.20), 0 25px 60px rgba(0,0,0,0.7)",
                isolation: "isolate",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/30 z-20 pointer-events-none rounded-t-3xl" />

              {/* Close Button — Liquid Glass Tile */}
              <button
                onClick={() => setSelectedAchievement(null)}
                aria-label={t("achievements.closeAria")}
                className="absolute top-4 right-4 z-30 p-2.5 rounded-2xl text-zinc-300 hover:text-white transition-all cursor-pointer group"
                style={{
                  background: "rgba(255, 255, 255, 0.10)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Image Area — Ultra-translucent Frosted Glass container */}
              <div
                className="w-full h-[30vh] sm:h-[42vh] shrink-0 relative flex items-center justify-center p-4 sm:p-8 border-b border-white/10 overflow-hidden"
                style={{ background: "rgba(0, 0, 0, 0.20)" }}
              >
                <img
                  src={selectedAchievement.image}
                  alt={selectedAchievement.title}
                  decoding="async"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl relative z-10 border border-white/15"
                />
              </div>

              {/* Content Area */}
              <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-zinc-800">
                <h2 className="text-2xl sm:text-3xl font-bold text-accent font-[Space_Grotesk] tracking-tight">
                  {selectedAchievement.title}
                </h2>

                <div className="flex flex-wrap gap-2">
                  {selectedAchievement.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs sm:text-sm px-3 py-1.5 rounded-lg text-zinc-300 font-medium"
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="h-px w-full bg-white/10 my-4" />

                <p className="text-zinc-200 leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-normal">
                  {selectedAchievement.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Achievements;
