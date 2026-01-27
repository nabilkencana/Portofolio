import { useState, useEffect, useMemo } from "react";
import { galleryData } from "../data/galleryData";
import InfiniteMenu from "../components/ui/InfiniteMenu";
import {
  Loader2,
  Camera,
  Image as ImageIcon,
  Zap,
  CheckCircle2,
  Smartphone,
  Monitor,
  AlertCircle
} from "lucide-react";

const Gallery = ({ activeColor }) => {
  const [ready, setReady] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [optimizedImages, setOptimizedImages] = useState([]);
  const [loadingStage, setLoadingStage] = useState("preparing");
  const [isMobile, setIsMobile] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fungsi untuk optimasi gambar di client-side
  const optimizeImageUrl = (url) => {
    if (!url) return null;

    if (url.includes('cloudinary') || url.includes('imgix')) {
      return url;
    }

    if (url.startsWith('/')) {
      return url;
    }

    return url;
  };

  const infiniteItems = useMemo(() => {
    // Validasi jika galleryData undefined atau bukan array
    if (!galleryData || !Array.isArray(galleryData)) {
      console.error('galleryData is undefined or not an array');
      return [];
    }

    try {
      return [...galleryData]
        .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
        .map((item) => ({
          image: item?.image || '',
          title: item?.title || 'Untitled',
          description: item?.description || '',
          link: item?.link || "#",
          placeholder: `data:image/svg+xml;base64,${btoa(
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
              <rect width="400" height="300" fill="#1f2937"/>
              <rect x="150" y="120" width="100" height="60" rx="10" fill="#374151"/>
              <circle cx="200" cy="150" r="20" fill="#4b5563"/>
            </svg>`
          )}`,
        }));
    } catch (error) {
      console.error('Error processing galleryData:', error);
      return [];
    }
  }, []);

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

  useEffect(() => {
    const loadImagesWithOptimization = async () => {
      try {
        setLoadingStage("preparing");
        setHasError(false);

        // Validasi infiniteItems
        if (!infiniteItems || infiniteItems.length === 0) {
          setLoadingStage("ready");
          setReady(true);
          return;
        }

        const imageUrls = infiniteItems.map(item => item.image);
        setTotalImages(imageUrls.length);

        setLoadingStage("optimizing");
        const optimizedUrls = imageUrls.map(url => optimizeImageUrl(url));
        setOptimizedImages(optimizedUrls);

        await new Promise(resolve => setTimeout(resolve, 300));

        setLoadingStage("loading");

        const loadPromises = optimizedUrls.map((src, index) => {
          return new Promise((resolve) => {
            // Skip jika tidak ada gambar
            if (!src) {
              setImagesLoaded(prev => prev + 1);
              return resolve();
            }

            const img = new Image();
            img.onload = () => {
              setImagesLoaded(prev => prev + 1);
              resolve();
            };
            img.onerror = () => {
              // Fallback ke placeholder jika gambar gagal load
              setImagesLoaded(prev => prev + 1);
              console.warn(`Failed to load image: ${src}`);
              resolve();
            };
            img.src = src;
          });
        });

        const timeoutPromise = new Promise(resolve => {
          setTimeout(() => {
            console.warn('Image loading timeout');
            resolve();
          }, isMobile ? 5000 : 8000);
        });

        await Promise.race([
          Promise.all(loadPromises),
          timeoutPromise
        ]);

        setLoadingStage("ready");
        setTimeout(() => setReady(true), 200);

      } catch (error) {
        console.error('Error loading images:', error);
        setHasError(true);
        setLoadingStage("ready");
        setTimeout(() => setReady(true), 300);
      }
    };

    loadImagesWithOptimization();
  }, [infiniteItems, isMobile]);

  const progressPercentage = totalImages > 0
    ? Math.round((imagesLoaded / totalImages) * 100)
    : 0;

  const getLoadingMessage = () => {
    if (hasError) return "Terjadi kesalahan saat memuat galeri";

    switch (loadingStage) {
      case "preparing":
        return "Menyiapkan galeri...";
      case "optimizing":
        return "Mengoptimasi gambar...";
      case "loading":
        return `Memuat gambar (${imagesLoaded}/${totalImages})...`;
      default:
        return "Hampir selesai...";
    }
  };

  // Jika tidak ada data
  if (infiniteItems.length === 0 && ready) {
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
      <div className="px-2 md:px-0">
        <h1 className="font-[Space_Grotesk] text-3xl md:text-4xl lg:text-5xl font-bold">
          Galeri Saya
        </h1>
        <p className="text-zinc-400 max-w-xl mt-2 md:mt-3 text-sm md:text-base">
          Momen dari perjalanan saya — ngoding, acara, hobi, dan kehidupan sehari-hari
        </p>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="h-[60vh] md:h-[70vh] lg:h-125 xl:h-[80vh] rounded-2xl md:rounded-3xl overflow-hidden relative bg-gradient-to-br from-zinc-900/50 to-zinc-950/50">

        {/* LOADING SCREEN */}
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 to-black z-10 p-4 md:p-8">
            <div className="text-center space-y-6 md:space-y-8 w-full max-w-sm md:max-w-md lg:max-w-lg p-4 md:p-8">

              {/* Error State */}
              {hasError && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Gagal memuat beberapa gambar</span>
                  </div>
                  <p className="text-xs text-red-300 mt-1">
                    Galeri akan ditampilkan dengan gambar yang tersedia
                  </p>
                </div>
              )}

              {/* Animated Header */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-accent/30 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 flex items-center justify-center">
                      {loadingStage === "ready" ? (
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                      ) : hasError ? (
                        <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                      ) : (
                        <Camera className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Device Indicator */}
                <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full">
                  {isMobile ? (
                    <>
                      <Smartphone className="w-4 h-4 text-accent" />
                      <span className="text-xs text-zinc-300">Mode Mobile</span>
                    </>
                  ) : (
                    <>
                      <Monitor className="w-4 h-4 text-accent" />
                      <span className="text-xs text-zinc-300">Mode Desktop</span>
                    </>
                  )}
                </div>

                {/* Stage Indicator */}
                <div className="flex items-center justify-center space-x-2 md:space-x-4">
                  {["preparing", "optimizing", "loading", "ready"].map((stage, index) => (
                    <div key={stage} className="flex items-center">
                      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${loadingStage === stage
                        ? hasError ? 'bg-yellow-500' : 'bg-accent animate-pulse'
                        : index < ["preparing", "optimizing", "loading", "ready"].indexOf(loadingStage)
                          ? hasError ? 'bg-yellow-500/50' : 'bg-accent'
                          : 'bg-zinc-700'
                        }`}></div>
                      {index < 3 && (
                        <div className={`w-2 md:w-4 h-0.5 ${index < ["preparing", "optimizing", "loading", "ready"].indexOf(loadingStage)
                          ? hasError ? 'bg-yellow-500/50' : 'bg-accent'
                          : 'bg-zinc-800'
                          }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading Content */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2 flex items-center justify-center gap-2">
                    {hasError ? (
                      <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                    ) : (
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    )}
                    {getLoadingMessage()}
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm">
                    {hasError
                      ? "Mencoba menampilkan gambar yang tersedia..."
                      : loadingStage === "optimizing"
                        ? "Mengurangi ukuran file untuk loading cepat"
                        : loadingStage === "loading"
                          ? "Tunggu sebentar, gambar sedang dimuat"
                          : "Mempersiapkan pengalaman terbaik"
                    }
                  </p>
                </div>

                {/* Progress Bar dengan Detail */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <div className="flex items-center gap-1 md:gap-2">
                      <ImageIcon className="w-3 h-3 md:w-4 md:h-4 text-zinc-400" />
                      <span className="text-zinc-300">
                        {imagesLoaded}/{totalImages} gambar
                      </span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Zap className={`w-3 h-3 md:w-4 md:h-4 ${hasError ? 'text-yellow-500' : 'text-accent'}`} />
                      <span className={`font-medium ${hasError ? 'text-yellow-500' : 'text-accent'}`}>
                        {progressPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 md:h-3 bg-zinc-900 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ease-out relative ${hasError
                          ? 'bg-gradient-to-r from-yellow-500/80 to-yellow-500'
                          : 'bg-gradient-to-r from-accent/80 to-accent'
                        }`}
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>

                  {/* Optimization Info */}
                  {!hasError && (
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center pt-2 md:pt-4">
                      <div className="flex items-center gap-1 bg-zinc-900/50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-zinc-300">
                          {isMobile ? "Mobile optimized" : "WebP format"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-zinc-900/50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-zinc-300">
                          {isMobile ? "Fast load" : "Lazy loading"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Specific Tips */}
                {isMobile && !hasError && (
                  <div className="bg-zinc-900/30 rounded-xl p-3 border border-zinc-800">
                    <p className="text-xs text-zinc-400 text-center">
                      💡 Gunakan WiFi untuk loading gambar yang lebih cepat
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GALLERY CONTENT */}
        {ready && infiniteItems.length > 0 && (
          <div className="animate-in fade-in duration-500 h-full">
            <div className="h-full">
              <InfiniteMenu
                items={infiniteItems.map((item, index) => ({
                  ...item,
                  image: optimizedImages[index] || item.image
                }))}
                mobileView={isMobile}
              />
            </div>

            {/* Floating Indicator */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
                <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
                <span className="text-xs text-zinc-300">
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
        )}

        {/* Error State setelah ready */}
        {ready && hasError && (
          <div className="absolute top-4 left-4 right-4 flex justify-center z-10">
            <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg px-4 py-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-yellow-300">
                Beberapa gambar gagal dimuat
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      {infiniteItems.length > 0 && (
        <div className="px-2 md:px-0">
        </div>
      )}

      {/* CSS untuk shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
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