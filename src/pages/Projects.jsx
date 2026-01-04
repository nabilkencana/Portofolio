import ChromaGrid from "../components/ui/ChromaGrid";
import { projectData } from "../data/projectData ";
import { motion } from "motion/react";

const Projects = () => {
  return (
    <section className="space-y-12 p-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <h1 className="font-[Space_Grotesk] text-4xl font-bold mt-1">My Projects</h1>
        <p className="text-zinc-400 max-w-xl mt-3">A selection of projects I’ve built using modern web technologies.</p>
      </motion.div>

      {/* PROJECT GRID */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="
    relative
    w-full
    overflow-hidden
    isolate
  "
      >
        <ChromaGrid items={projectData} radius={320} damping={0.5} fadeOut={0.7} />
      </motion.div>
    </section>
  );
};

export default Projects;
