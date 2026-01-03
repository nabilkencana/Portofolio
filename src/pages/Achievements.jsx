import React from "react";
import SpotlightCard from "../components/spotlight_card/SpotlightCard";
import { achievementsData } from "../data/achievementsData";
import { motion } from "motion/react";

const Achievements = () => {
  return (
    <section className="space-y-3 relative">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="p-6 max-w-2xl">
          <h1 className="font-[Space_Grotesk] text-4xl font-bold">Achievements</h1>
          <p className="text-zinc-400 mt-3 leading-relaxed">A selection of certifications and learning achievements that reflect my continuous growth in technology and problem solving.</p>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {achievementsData.map((item, index) => (
          <SpotlightCard key={index} spotlightColor="rgba(0, 229, 255, 0.12)" className="rounded-2xl overflow-hidden bg-zinc-900/60">
            {/* IMAGE (DOMINANT) */}
            <div className="relative w-full overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover border-2" />

              {/* subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-3">
              {/* TITLE */}
              <h3 className="font-semibold text-lg text-(--accent)">{item.title}</h3>

              {/* TECH STACK */}
              <div className="flex flex-wrap gap-2">
                {item.tech.map((tech, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md bg-zinc-800/80 text-zinc-300">
                    {tech}
                  </span>
                ))}
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
            </div>
          </SpotlightCard>
        ))}
      </motion.div>
    </section>
  );
};

export default Achievements;
