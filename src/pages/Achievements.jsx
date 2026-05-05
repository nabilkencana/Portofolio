import React, { useState, useEffect } from "react";
import SpotlightCard from "../components/spotlight_card/SpotlightCard";
import { achievementsData } from "../data/achievementsData";
import { getMergedAchievements } from "../lib/adminStore";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const Achievements = () => {
  const [allAchievements, setAllAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Listen for admin panel updates and initial load
  useEffect(() => {
    const loadData = async () => {
      const data = await getMergedAchievements(achievementsData);
      setAllAchievements(data);
    };

    loadData();

    const handler = () => loadData();
    window.addEventListener("adminDataUpdated", handler);
    return () => window.removeEventListener("adminDataUpdated", handler);
  }, []);
  
  return (
    <section className="space-y-3 relative">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="p-6 max-w-2xl">
          <h1 className="font-[Space_Grotesk] text-4xl font-bold">Pencapaian</h1>
          <p className="text-zinc-400 mt-3 leading-relaxed">Beberapa sertifikasi dan pencapaian pembelajaran yang mencerminkan perkembangan saya dalam teknologi dan pemecahan masalah.</p>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {allAchievements.map((item, index) => (
          <div key={index} onClick={() => setSelectedAchievement(item)} className="cursor-pointer group">
            <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.12)" className="rounded-2xl overflow-hidden bg-zinc-900/60 transition-transform duration-300 group-hover:scale-[1.02] h-full">
              {/* IMAGE (DOMINANT) */}
              <div className="relative w-full overflow-hidden aspect-video">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover border-2" />

                {/* subtle overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-3">
                {/* TITLE */}
                <h3 className="font-semibold text-lg text-accent">{item.title}</h3>

                {/* TECH STACK */}
                <div className="flex flex-wrap gap-2">
                  {item.tech.map((tech, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-zinc-800/80 text-zinc-300">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* DESCRIPTION */}
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{item.description}</p>
              </div>
            </SpotlightCard>
          </div>
        ))}
      </motion.div>

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
