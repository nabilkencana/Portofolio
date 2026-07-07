import React, { useState, useEffect } from "react";
import SpotlightCard from "../components/spotlight_card/SpotlightCard";
import { achievementsData } from "../data/achievementsData";
import { getMergedAchievements } from "../lib/adminStore";
import { isAdminLoggedIn } from "../lib/adminAuth";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus } from "lucide-react";

const Achievements = () => {
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
  
  return (
    <section className="space-y-3 relative">
      {/* Header */}
      <div>
        <div className="p-6 max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-[Space_Grotesk] text-4xl font-bold">Pencapaian</h1>
              <p className="text-zinc-400 mt-3 leading-relaxed">Beberapa sertifikasi dan pencapaian pembelajaran yang mencerminkan perkembangan saya dalam teknologi dan pemecahan masalah.</p>
            </div>
            {adminMode && (
              <button
                onClick={() => window.openAdminWithTab?.("achievement")}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/60
                  text-accent transition-all duration-200 mt-1"
              >
                <Plus size={16} />
                Tambah
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid — no entrance animation, data is already in useState */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-6">
        {allAchievements.map((item, index) => (
          <motion.div
            key={item.id || index}
            whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
            onClick={() => setSelectedAchievement(item)}
            className="cursor-pointer group"
          >
            <SpotlightCard
              spotlightColor="rgba(0, 229, 255, 0.15)"
              className="rounded-2xl overflow-hidden bg-zinc-900/60 h-full ring-1 ring-transparent group-hover:ring-accent/30 transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(var(--accent-rgb),0.18)]"
            >
              {/* IMAGE */}
              <div className="relative w-full overflow-hidden aspect-video">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover border-2 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg text-accent group-hover:translate-x-1 transition-transform duration-200">{item.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(item.tech) ? item.tech : []).map((tech, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-zinc-800/80 text-zinc-300">{tech}</span>
                  ))}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{item.description}</p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>

              {/* Image */}
              <div className="w-full h-[30vh] sm:h-[45vh] bg-zinc-900 shrink-0 relative flex items-center justify-center p-4">
                <img
                  src={selectedAchievement.image}
                  alt={selectedAchievement.title}
                  className="max-w-full max-h-full object-contain rounded-lg drop-shadow-lg"
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-accent font-[Space_Grotesk]">
                  {selectedAchievement.title}
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {selectedAchievement.tech.map((tech, i) => (
                    <span key={i} className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="h-px w-full bg-zinc-800/50 my-4" />

                <p className="text-zinc-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
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
