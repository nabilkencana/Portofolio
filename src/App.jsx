import { useState, useEffect, useCallback } from "react";
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
import ChatBot from "./components/ChatBot";
import { getRedirectResult } from "firebase/auth";
import { auth } from "./lib/firebase";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminPanel from "./pages/AdminPanel";
import { isAdminLoggedIn } from "./lib/adminAuth";


const App = () => {
  // page
  const [activePage, setActivePage] = useState("tentang");
  // color
  const [activeColor, setActiveColor] = useState("emerald");
  // hamburger menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // preloader
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  // admin
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
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
      case "proyek":
        return <Projects />;
      case "galeri":
        return <Gallery activeColor={activeColor} />;
      case "keahlian":
        return <Skills />;
      case "kontak":
        return <Contact />;
      case "pencapaian":
        return <Achievements />;
      case "chat":
        return <Chat />;
      default:
        return  <About isReady={isReady} />;
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Login GitHub sukses:", result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect error:", error);
      });
  }, []);

  // Hidden admin shortcut: Ctrl + Shift + A
  const handleKeydown = useCallback((e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "A") {
      e.preventDefault();
      if (isAdminLoggedIn()) {
        setShowAdminPanel(true);
      } else {
        setShowAdminLogin(true);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);


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
      <ChatBot />

      {/* HIDDEN ADMIN — hanya via Ctrl+Shift+A */}
      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={() => { setShowAdminLogin(false); setShowAdminPanel(true); }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
};

export default App;
