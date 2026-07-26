import ChromaGrid from "../components/ui/ChromaGrid";
import { projectData } from "../data/projectData";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { getMergedProjects } from "../lib/adminStore";
import { isAdminLoggedIn } from "../lib/adminAuth";
import { X, ExternalLink, Plus } from "lucide-react";

const Projects = () => {
  // Show static data immediately — Firestore merge happens silently in background
  const [allProjects, setAllProjects] = useState(projectData);
  const [selectedProject, setSelectedProject] = useState(null);
  const [adminMode, setAdminMode] = useState(isAdminLoggedIn());

  useEffect(() => {
    const merge = () =>
      getMergedProjects(projectData).then((data) => {
        setAllProjects(data);
        setAdminMode(isAdminLoggedIn());
      });
    merge();
    window.addEventListener("adminDataUpdated", merge);
    return () => window.removeEventListener("adminDataUpdated", merge);
  }, []);

  return (
    <section className="space-y-12 p-6 relative">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-[Space_Grotesk] text-4xl font-bold mt-1">Proyek Saya</h1>
            <p className="text-zinc-400 max-w-xl mt-3">Beberapa proyek yang telah saya bangun menggunakan teknologi web modern.</p>
          </div>
          {adminMode && (
            <button
              onClick={() => window.openAdminWithTab?.("project")}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/60
                text-accent transition-all duration-200 mt-1"
            >
              <Plus size={16} />
              Tambah Proyek
            </button>
          )}
        </div>
      </motion.div>

      {/* PROJECT GRID — staggered fade-in wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative w-full isolate pb-8"
      >
        <ChromaGrid items={allProjects} radius={320} damping={0.5} fadeOut={0.7} onItemClick={(item) => setSelectedProject(item)} />
      </motion.div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
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
              {/* Liquid Glass top shimmer highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/30 z-20 pointer-events-none rounded-t-3xl" />

              {/* Close Button — Liquid Glass Tile */}
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Tutup detail proyek"
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

              {/* Image Area — Ultra-translucent Frosted Glass container with subtle project ambient glow */}
              <div
                className="w-full h-[30vh] sm:h-[42vh] shrink-0 relative flex items-center justify-center p-4 sm:p-8 border-b border-white/10 overflow-hidden"
                style={{ background: "rgba(0, 0, 0, 0.20)" }}
              >
                {/* Ambient glow behind preview image */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${selectedProject.borderColor || "#10b981"}55 0%, transparent 70%)`,
                  }}
                />
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  decoding="async"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl relative z-10 border border-white/15"
                />
              </div>

              {/* Content Area */}
              <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-zinc-800">
                <h2
                  className="text-2xl sm:text-3xl font-bold font-[Space_Grotesk] tracking-tight"
                  style={{
                    color: selectedProject.borderColor || "#10b981",
                    textShadow: `0 0 20px ${selectedProject.borderColor || "#10b981"}33`,
                  }}
                >
                  {selectedProject.title}
                </h2>

                <p className="text-zinc-200 leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-normal">
                  {selectedProject.subtitle}
                </p>

                {selectedProject.url && (
                  <div className="mt-6 pt-6 border-t border-white/10 flex justify-start">
                    <a
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                      style={{
                        background: selectedProject.borderColor || "#10b981",
                        color: "#000",
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px ${selectedProject.borderColor || "#10b981"}45`,
                      }}
                    >
                      Buka Proyek <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;

