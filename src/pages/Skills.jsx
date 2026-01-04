import MagicBento from "../components/ui/MagicBento";
import skillsData from "../data/cardData";
import { motion } from "motion/react";

const Skills = () => {
  return (
    <section className="space-y-12 p-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <h1 className="font-[Space_Grotesk] text-4xl font-bold">My Skills</h1>
        <p className="text-zinc-400 max-w-xl mt-3">Technologies and tools I use to build modern web applications.</p>
      </motion.div>

      {/* SKILLS GRID */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}>
        <MagicBento data={skillsData} />
      </motion.div>
    </section>
  );
};

export default Skills;
