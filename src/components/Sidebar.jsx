import avatar2 from "../assets/avatar2.png";

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
  { id: "about", label: "About", icon: "ri-user-3-line" },
  { id: "gallery", label: "Gallery", icon: "ri-image-line" },
  { id: "skills", label: "Skills", icon: "ri-code-line" },
  { id: "projects", label: "Projects", icon: "ri-folder-line" },
  { id: "achievements", label: "Achievements", icon: "ri-award-line" },
  { id: "contact", label: "Contact", icon: "ri-mail-line" },
  { id: "chat", label: "Chat", icon: "ri-chat-3-line" },
];

const Sidebar = ({ setActivePage, activePage, activeColor, setActiveColor, isOpen, setIsOpen }) => {
  return (
    <>
      {/* Overlay - MOBILE ONLY */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
        fixed inset-0 z-30 lg:hidden
        bg-black/50
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        transition-all duration-300
    `}
      />

      {/* SIDEBAR (SINGLE SOURCE OF TRUTH) */}
      <aside
        className={`
        fixed z-40 
        top-4 bottom-4 left-4
        w-72
        rounded-2xl
        bg-zinc-900/80 backdrop-blur
        border border-zinc-800 shadow-2xl
        p-6 flex flex-col

        transition-all duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}

        lg:static lg:translate-x-0
    `}
      >
        {/* Profile */}
        <div className="mb-8 text-center">
          <img
            src={avatar2}
            alt="profile"
            onClick={() => setActivePage("about")}
            className={`hover:cursor-pointer mx-auto w-14 h-14 rounded-full mb-4 ring-2
              ${activeColor === "emerald" ? "ring-emerald-500" : activeColor === "sky" ? "ring-sky-500" : activeColor === "violet" ? "ring-violet-500" : activeColor === "amber" ? "ring-amber-200" : "ring-red-500"}`}
          />

          <h2 className="text-xl font-bold font-[Space_Grotesk]">Sajid Izzulhaq</h2>
          <p className="text-sm text-zinc-400">Fullstack</p>
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => {
                setActivePage(id);
                setIsOpen(false);
              }}
              className={`
        group w-full flex items-center gap-3
        px-3 py-2 rounded-lg
        text-sm font-medium
        transition-all duration-200 cursor-pointer 

        ${activePage === id ? colorMap[activeColor] : `text-zinc-400 ${hoverMap[activeColor]}`}
      `}
            >
              {/* ICON */}
              <i
                className={`
          ${icon}
          text-base
          opacity-80
          group-hover:opacity-100 group-hover:-rotate-3 group-hover:scale-110
          transition
          
        `}
              />

              {/* LABEL */}
              <span className="tracking-wide">{label}</span>
            </button>
          ))}
        </nav>

        {/* Theme Switcher */}
        <div className="pt-4 border-t border-zinc-800">
          <p className="text-[10px] text-zinc-500 text-center mb-3 tracking-[0.25em]">
            THEME
            <span className="ml-2 capitalize text-(--accent)">{activeColor}</span>
          </p>

          <div className="flex justify-center gap-3">
            {[
              { name: "emerald", class: "bg-emerald-500" },
              { name: "sky", class: "bg-sky-500" },
              { name: "violet", class: "bg-violet-500" },
              { name: "amber", class: "bg-amber-200" },
              { name: "red", class: "bg-red-500" },
            ].map(({ name, class: bg }) => (
              <button
                key={name}
                onClick={() => setActiveColor(name)}
                aria-label={`theme-${name}`}
                className={`
          w-5 h-5 rounded-full
          ${bg}
          transition-all duration-200
          ${activeColor === name ? "ring-1 ring-white/80" : "opacity-60 hover:opacity-100 hover:ring-1 hover:ring-white/30"}
        `}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
