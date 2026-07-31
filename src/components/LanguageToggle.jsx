import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";
import { motion } from "motion/react";

const LanguageToggle = ({ className = "" }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      aria-label={`Ganti Bahasa. Bahasa aktif: ${language.toUpperCase()}`}
      title={language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        text-xs font-semibold tracking-wider cursor-pointer border border-white/15
        transition-all duration-300 group ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Globe size={15} className="text-(--accent) group-hover:rotate-12 transition-transform duration-300 shrink-0" />

      <div className="flex items-center gap-1 font-mono text-[11px]">
        <span
          className={`px-1.5 py-0.5 rounded-md transition-all duration-300 ${
            language === "id"
              ? "text-black font-bold bg-(--accent) shadow-sm"
              : "text-zinc-400 group-hover:text-zinc-200"
          }`}
        >
          ID
        </span>
        <span className="text-zinc-600 font-normal">|</span>
        <span
          className={`px-1.5 py-0.5 rounded-md transition-all duration-300 ${
            language === "en"
              ? "text-black font-bold bg-(--accent) shadow-sm"
              : "text-zinc-400 group-hover:text-zinc-200"
          }`}
        >
          EN
        </span>
      </div>
    </motion.button>
  );
};

export default LanguageToggle;
