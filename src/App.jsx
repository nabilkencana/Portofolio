import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import About from "./pages/About";
import Aurora from "./components/ui/Aurora";
import Preloader from "./components/ui/PreLoader";
import ChatBot from "./components/ChatBot";
import { getRedirectResult } from "firebase/auth";
import { auth } from "./lib/firebase";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminPanel from "./pages/AdminPanel";
import { isAdminLoggedIn } from "./lib/adminAuth";

// Code Splitting - Lazy Load off-screen routes
const Projects = lazy(() => import("./pages/Projects"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Skills = lazy(() => import("./pages/Skills"));
const Contact = lazy(() => import("./pages/Contact"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Chat = lazy(() => import("./pages/Chat"));

const App = () => {
  const [activePage, setActivePage] = useState("tentang");
  const [activeColor, setActiveColor] = useState("emerald");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTab, setAdminTab] = useState("gallery");

  const scrollbarColors = {
    emerald: "#10b981", sky: "#0ea5e9", violet: "#8b5cf6", amber: "#FEE685", red: "#ef4444",
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--scroll-thumb", scrollbarColors[activeColor]);
  });

  const themeMap = {
    emerald: { accent: "#10b981", accentRgb: "16, 185, 129" },
    sky:     { accent: "#0ea5e9", accentRgb: "14, 165, 233" },
    violet:  { accent: "#8b5cf6", accentRgb: "139, 92, 246" },
    amber:   { accent: "#FEE685", accentRgb: "245, 158, 11" },
    red:     { accent: "#ef4444", accentRgb: "239, 68, 68" },
  };

  useEffect(() => {
    const theme = themeMap[activeColor];
    if (!theme) return;
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--accent-rgb", theme.accentRgb);
  }, [activeColor]);

  const openAdmin = useCallback((tab = "gallery") => {
    setAdminTab(tab);
    if (isAdminLoggedIn()) setShowAdminPanel(true);
    else setShowAdminLogin(true);
  }, []);

  // Global helper — callable from any page: window.openAdminWithTab("gallery")
  useEffect(() => {
    window.openAdminWithTab = openAdmin;
    return () => { delete window.openAdminWithTab; };
  }, [openAdmin]);

  const renderPage = () => {
    switch (activePage) {
      case "proyek":     return <Projects />;
      case "galeri":     return <Gallery activeColor={activeColor} />;
      case "keahlian":   return <Skills />;
      case "kontak":     return <Contact />;
      case "pencapaian": return <Achievements />;
      case "chat":       return <Chat />;
      default:           return <About isReady={isReady} />;
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((r) => { if (r?.user) console.log("Login GitHub sukses:", r.user); })
      .catch((e) => console.error("Redirect error:", e));
  }, []);

  // Secret shortcut — only you know it: Ctrl + Shift + A
  const handleKeydown = useCallback((e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "A") {
      e.preventDefault();
      openAdmin("gallery");
    }
  }, [openAdmin]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  return (
    <div className="select-none relative min-h-screen bg-zinc-950 overflow-hidden">
      <Aurora style={{ border: "2px solid black" }} />

      <div className="relative z-10 flex items-center justify-center p-6 h-screen">
        <div className={`w-full max-w-7xl h-[85vh] bg-zinc-900 rounded-2xl shadow-2xl flex text-zinc-100 ${activeColor}`}>
          <Sidebar
            setActivePage={setActivePage}
            activePage={activePage}
            setActiveColor={setActiveColor}
            activeColor={activeColor}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
          <div className="flex-1 flex flex-col">
            <Topbar activePage={activePage} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto">
              <Suspense fallback={<div className="h-full w-full bg-zinc-950 flex items-center justify-center text-zinc-500 font-medium">Memuat Halaman...</div>}>
                {renderPage()}
              </Suspense>
            </main>
          </div>
        </div>
      </div>

      {!isReady && <Preloader onFinish={() => setIsReady(true)} />}
      <ChatBot />

      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={() => {
            setShowAdminLogin(false);
            setShowAdminPanel(true);
            window.dispatchEvent(new Event("adminDataUpdated"));
          }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          initialTab={adminTab}
        />
      )}
    </div>
  );
};

export default App;
