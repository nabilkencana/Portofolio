import avatar2 from "../assets/avatar2.webp";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

const colorMap = {
  emerald: "bg-emerald-500 !text-black",
  sky: "bg-sky-500 !text-white",
  violet: "bg-violet-500 !text-white",
  amber: "bg-amber-200 !text-black",
  red: "bg-red-500 !text-white",
};

const hoverMap = {
  emerald: "hover:bg-emerald-500/20",
  sky: "hover:bg-sky-500/20",
  violet: "hover:bg-violet-500/20",
  amber: "hover:bg-amber-200/20",
  red: "hover:bg-red-500/20",
};

const navItems = [
  { id: "tentang", icon: "ri-user-3-line" },
  { id: "galeri", icon: "ri-image-line" },
  { id: "keahlian", icon: "ri-code-line" },
  { id: "proyek", icon: "ri-folder-line" },
  { id: "pencapaian", icon: "ri-award-line" },
  { id: "kontak", icon: "ri-mail-line" },
  { id: "chat", icon: "ri-chat-3-line" },
];

const Sidebar = ({ setActivePage, activePage, activeColor, setActiveColor, isOpen, setIsOpen }) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Overlay - MOBILE ONLY */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-xs
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          transition-all duration-300`}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed z-50 top-0 bottom-0 left-0 w-72 rounded-r-3xl
          p-6 flex flex-col transition-all duration-300 ease-out overflow-hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:rounded-2xl lg:z-40 lg:w-72 lg:shrink-0 lg:h-full lg:overflow-hidden`}
        style={{
          background: "rgba(18, 18, 24, 0.92)",
          borderRight: "1px solid rgba(255, 255, 255, 0.10)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow: "inset 1px 0 0 rgba(255, 255, 255, 0.10)",
        }}
      >
        {/* Liquid Glass Top Shimmer Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/20 pointer-events-none z-30 rounded-t-2xl" />

        {/* Profile */}
        <div className="mb-6 text-center relative z-10">
          <button
            onClick={() => setActivePage("tentang")}
            aria-label={t("sidebarAvatarAria")}
            className="block mx-auto mb-3 rounded-full focus:outline-none focus:ring-2 focus:ring-accent group cursor-pointer"
          >
            <div className="relative inline-flex items-center justify-center p-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-white/40">
              <img
                src={avatar2}
                alt="M. Nabil Anwar Kencana Profile"
                width="64"
                height="64"
                decoding="async"
                className="w-16 h-16 rounded-full object-cover shadow-inner"
              />
              <div
                className="absolute inset-0 rounded-full pointer-events-none transition-all duration-300 opacity-70 group-hover:opacity-100"
                style={{
                  boxShadow: `0 0 20px ${activeColor === "emerald" ? "rgba(16, 185, 129, 0.55)"
                    : activeColor === "sky" ? "rgba(2, 132, 199, 0.55)"
                      : activeColor === "violet" ? "rgba(139, 92, 246, 0.55)"
                        : activeColor === "amber" ? "rgba(253, 224, 71, 0.55)"
                          : "rgba(239, 68, 68, 0.55)"
                    }`,
                }}
              />
            </div>
          </button>
          <h2 className="text-xl font-bold font-[Space_Grotesk] text-zinc-100 tracking-tight">M. Nabil Anwar K.</h2>
          <p className="text-xs text-zinc-400 font-mono mt-1 tracking-wide">Junior Software Engineer</p>
        </div>

        {/* Navigation — flex-1 min-h-0 agar tidak stretch ke konten */}
        <nav className="flex-1 min-h-0 overflow-y-auto space-y-1.5 relative z-10 pr-0.5">
          {navItems.map(({ id, icon }) => {
            const isActive = activePage === id;
            const label = t(`nav.${id}`);
            return (
              <button
                key={id}
                onClick={() => { setActivePage(id); setIsOpen(false); }}
                className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200 cursor-pointer border
                  ${isActive
                    ? "text-white border-white/20 shadow-lg"
                    : "text-zinc-400 hover:text-white border-transparent hover:border-white/10 hover:bg-white/5"}`}
                style={
                  isActive
                    ? {
                      background: "rgba(255, 255, 255, 0.10)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.20), 0 4px 16px rgba(0, 0, 0, 0.3)",
                    }
                    : {}
                }
              >
                <i className={`${icon} text-base transition-transform duration-200
                  ${isActive ? "text-(--accent) scale-110" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"}`} />
                <span className={`tracking-wide ${isActive ? "font-semibold text-zinc-100" : ""}`}>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme Switcher — ALWAYS PINNED AT BOTTOM */}
        <div className="pt-3 mt-auto border-t border-white/10 relative z-20 shrink-0">
          <p className="text-[10px] text-zinc-400 text-center mb-3 tracking-[0.25em] font-mono">
            {t("theme")} <span className="ml-1.5 capitalize text-(--accent) font-semibold">{activeColor}</span>
          </p>
          <div className="flex justify-center gap-3">
            {[
              { name: "emerald", class: "bg-emerald-500", glow: "rgba(16, 185, 129, 0.6)" },
              { name: "sky", class: "bg-sky-500", glow: "rgba(2, 132, 199, 0.6)" },
              { name: "violet", class: "bg-violet-500", glow: "rgba(139, 92, 246, 0.6)" },
              { name: "amber", class: "bg-amber-300", glow: "rgba(253, 224, 71, 0.6)" },
              { name: "red", class: "bg-red-500", glow: "rgba(239, 68, 68, 0.6)" },
            ].map(({ name, class: bg, glow }) => (
              <button
                key={name}
                onClick={() => setActiveColor(name)}
                aria-label={`${t("themeAria")} ${name}`}
                className={`w-5 h-5 rounded-full ${bg} transition-all duration-300 cursor-pointer
                  ${activeColor === name
                    ? "scale-115 ring-2 ring-white"
                    : "opacity-60 hover:opacity-100 hover:scale-105"}`}
                style={{
                  boxShadow: activeColor === name ? `0 0 12px ${glow}` : "none",
                }}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
