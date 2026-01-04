import { useState, useEffect } from "react";
import Projects from "./pages/Projects";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Achievements from "./pages/Achievements";
import Chat from "./pages/Chat";
import Aurora from "./components/ui/Aurora";
import Preloader from "./components/ui/PreLoader";

const App = () => {
  // page
  const [activePage, setActivePage] = useState("about");
  // color
  const [activeColor, setActiveColor] = useState("emerald");
  // hamburger menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // preloader
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  // scrollbarcolos
  const scrollbarColors = {
    emerald: "#10b981",
    sky: "#0ea5e9",
    violet: "#8b5cf6",
    amber: "#FEE685",
    red: "#ef4444",
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--scroll-thumb", scrollbarColors[activeColor]);
  });

  const themeMap = {
    emerald: {
      accent: "#10b981",
      accentRgb: "16, 185, 129",
    },
    sky: {
      accent: "#0ea5e9",
      accentRgb: "14, 165, 233",
    },
    violet: {
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
    },
    amber: {
      accent: "#FEE685",
      accentRgb: "245, 158, 11",
    },
    red: {
      accent: "#ef4444",
      accentRgb: "239, 68, 68",
    },
  };

  useEffect(() => {
    const theme = themeMap[activeColor];

    if (!theme) return;

    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--accent-rgb", theme.accentRgb);
  }, [activeColor]);

  const renderPage = () => {
    switch (activePage) {
      case "projects":
        return <Projects />;
      case "gallery":
        return <Gallery activeColor={activeColor} />;
      case "skills":
        return <Skills />;
      case "contact":
        return <Contact />;
      case "achievements":
        return <Achievements />;
      case "chat":
        return <Chat />;
      default:
        return  <About isReady={isReady} />;
    }
  };

  return (
    <div className={`select-none relative min-h-screen bg-zinc-950 overflow-hidden {${loading ? "opacity-0" : "opacity-100"}`}>
      {/* BACKGROUND */}
      <Aurora style={{ border: "2px solid black" }} />

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex items-center justify-center p-6 h-screen ">
        <div className={`w-full max-w-7xl h-[85vh] bg-zinc-900 rounded-2xl shadow-2xl flex text-zinc-100 ${activeColor}`}>
          <Sidebar setActivePage={setActivePage} activePage={activePage} setActiveColor={setActiveColor} activeColor={activeColor} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

          <div className="flex-1 flex flex-col">
            <Topbar activePage={activePage} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto">{renderPage()}</main>
          </div>
        </div>
      </div>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      {!isReady && <Preloader onFinish={() => setIsReady(true)} />}
    </div>
  );
};

export default App;
