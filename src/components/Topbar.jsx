import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

const Topbar = ({ activePage, setIsSidebarOpen }) => {
  const { t } = useLanguage();
  const pageTitle = t(`nav.${activePage}`) || activePage;

  return (
    <header
      className="h-16 px-6 flex items-center justify-between"
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(255, 255, 255, 0.015)",
      }}
    >
      <div className="flex items-center gap-3">
        <button className="lg:hidden block text-zinc-300 hover:text-white" onClick={() => setIsSidebarOpen(true)} aria-label="Open Sidebar Menu">
          <i className="ri-menu-4-line text-2xl"></i>
        </button>
        <h1 className="capitalize font-semibold text-zinc-100">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <LanguageToggle />
      </div>
    </header>
  );
};

export default Topbar;
