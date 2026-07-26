import { useState, useEffect, useMemo } from "react";
import { galleryData } from "../data/galleryData";
import InfiniteMenu from "../components/ui/InfiniteMenu";
import { getMergedGallery } from "../lib/adminStore";
import { isAdminLoggedIn } from "../lib/adminAuth";
import { Loader2, AlertCircle, Plus } from "lucide-react";

const Gallery = ({ activeColor }) => {
  // Show static data immediately — Firestore merge happens silently in background
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mergedGallery, setMergedGallery] = useState(galleryData);
  const [adminMode, setAdminMode] = useState(isAdminLoggedIn());

  useEffect(() => {
    const merge = () =>
      getMergedGallery(galleryData)
        .then((data) => { setMergedGallery(data); setAdminMode(isAdminLoggedIn()); })
        .catch(console.error);
    merge();
    window.addEventListener("adminDataUpdated", merge);
    return () => window.removeEventListener("adminDataUpdated", merge);
  }, []);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Gunakan data gabungan yang sudah di-merge dari adminStore
  const infiniteItems = useMemo(() => {
    const combined = mergedGallery;

    if (!combined || !Array.isArray(combined)) {
      console.error("galleryData is undefined or not an array");
      return [];
    }

    try {
      return combined
        .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
        .map((item) => ({
          image: item?.image || "",
          title: item?.title || "Untitled",
          description: item?.description || "",
          link: item?.link || "#",
        }));
    } catch (error) {
      console.error("Error processing galleryData:", error);
      return [];
    }
  }, [mergedGallery]);

  useEffect(() => {
    const root = document.documentElement;
    const accentMap = {
      emerald: { bg: "#10b981", text: "#000000" },
      sky: { bg: "#0ea5e9", text: "#ffffff" },
      violet: { bg: "#8b5cf6", text: "#ffffff" },
      amber: { bg: "#fde68a", text: "#000000" },
      red: { bg: "#ef4444", text: "#ffffff" },
    };

    const accent = accentMap[activeColor];
    if (!accent) return;

    root.style.setProperty("--accent", accent.bg);
    root.style.setProperty("--accent-text", accent.text);
  }, [activeColor]);

  // Loading state
  if (loading) {
    return (
      <section className="space-y-8 md:space-y-12 p-4 md:p-6 lg:p-8">
        <div className="px-2 md:px-0">
          <h1 className="font-[Space_Grotesk] text-3xl md:text-4xl lg:text-5xl font-bold">
            Galeri Saya
          </h1>
          <p className="text-zinc-400 max-w-xl mt-2 md:mt-3 text-sm md:text-base">
            Momen dari perjalanan saya — ngoding, acara, hobi, dan kehidupan sehari-hari
          </p>
        </div>

        <div className="h-[60vh] md:h-[70vh] lg:h-125 rounded-2xl md:rounded-3xl flex items-center justify-center bg-gradient-to-br from-zinc-900/50 to-zinc-950/50">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto" />
            <p className="text-zinc-400 text-sm">Menghubungkan ke galeri...</p>
          </div>
        </div>
      </section>
    );
  }

  // Jika tidak ada data
  if (infiniteItems.length === 0) {
    return (
      <section className="space-y-8 md:space-y-12 p-4 md:p-6 lg:p-8">
        <div className="px-2 md:px-0">
          <h1 className="font-[Space_Grotesk] text-3xl md:text-4xl lg:text-5xl font-bold">
            Galeri Saya
          </h1>
          <p className="text-zinc-400 max-w-xl mt-2 md:mt-3 text-sm md:text-base">
            Momen dari perjalanan saya — ngoding, acara, hobi, dan kehidupan sehari-hari
          </p>
        </div>

        <div className="h-[60vh] md:h-[70vh] lg:h-125 rounded-2xl md:rounded-3xl flex items-center justify-center bg-gradient-to-br from-zinc-900/50 to-zinc-950/50">
          <div className="text-center space-y-4 p-8">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto" />
            <h3 className="text-xl font-semibold text-white">Galeri Kosong</h3>
            <p className="text-zinc-400">
              Tidak ada foto yang tersedia untuk ditampilkan.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8 md:space-y-12 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="px-2 md:px-0 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[Space_Grotesk] text-3xl md:text-4xl lg:text-5xl font-bold">
            Galeri Saya
          </h1>
          <p className="text-zinc-400 max-w-xl mt-2 md:mt-3 text-sm md:text-base">
            Momen dari perjalanan saya — ngoding, acara, hobi, dan kehidupan sehari-hari
          </p>
        </div>
        {adminMode && (
          <button
            onClick={() => window.openAdminWithTab?.("gallery")}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
              bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/60
              text-accent transition-all duration-200 mt-1"
          >
            <Plus size={16} />
            Tambah Foto
          </button>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div
        className="h-[60vh] md:h-[70vh] lg:h-125 xl:h-[80vh] rounded-3xl overflow-hidden relative"
        style={{
          background: "rgba(18, 18, 24, 0.40)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 50px rgba(0, 0, 0, 0.4)",
          isolation: "isolate",
        }}
      >
        {/* Liquid Glass top shimmer highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/25 pointer-events-none z-30 rounded-t-3xl" />

        {/* GALLERY CONTENT */}
        <div className="animate-in fade-in duration-500 h-full">
          <div className="h-full">
            <InfiniteMenu
              items={infiniteItems}
              mobileView={isMobile}
            />
          </div>

          {/* Floating Indicator — positioned above bottom edge on mobile to avoid collision */}
          <div className="absolute bottom-16 sm:bottom-4 right-4 md:right-6 z-20">
            <div
              className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs text-zinc-200 font-medium"
              style={{
                background: "rgba(18, 18, 24, 0.75)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.10)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>
                {isMobile ? (
                  <>
                    <span className="hidden sm:inline">Touch & swipe </span>
                    <span className="sm:hidden">Swipe </span>
                    untuk navigasi
                  </>
                ) : (
                  "Drag untuk navigasi"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS untuk breakpoints */}
      <style>{`
        /* Responsive breakpoints */
        @media (max-width: 640px) {
          .h-125 {
            height: 60vh !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .h-125 {
            height: 70vh !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .h-125 {
            height: 75vh !important;
          }
        }
        
        @media (min-width: 1025px) and (max-width: 1280px) {
          .h-125 {
            height: 80vh !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Gallery;