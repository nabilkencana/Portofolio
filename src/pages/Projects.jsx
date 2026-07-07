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
        className="relative w-full overflow-hidden isolate"
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
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
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>

              {/* Image Area with Project's Custom Gradient */}
              <div 
                className="w-full h-[30vh] sm:h-[45vh] shrink-0 relative flex items-center justify-center p-4 sm:p-8" 
                style={{ background: selectedProject.gradient || "#18181b" }}
              >
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
                <h2 
                  className="text-2xl sm:text-3xl font-bold font-[Space_Grotesk]" 
                  style={{ color: selectedProject.borderColor || "#10b981" }}
                >
                  {selectedProject.title}
                </h2>
                
                <p className="text-zinc-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-medium">
                  {selectedProject.subtitle}
                </p>

                {selectedProject.url && (
                  <div className="mt-6 pt-6 border-t border-zinc-800/50">
                    <a
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
                      style={{ 
                        background: selectedProject.borderColor || "#10b981", 
                        boxShadow: `0 4px 20px ${selectedProject.borderColor || "#10b981"}40` 
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

