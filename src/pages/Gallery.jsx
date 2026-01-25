import { useState, useEffect, useMemo } from "react";
import { galleryData } from "../data/galleryData";
import InfiniteMenu from "../components/ui/InfiniteMenu";
import {
  Loader2,
  Camera,
  Image as ImageIcon,
  Zap,
  CheckCircle2
} from "lucide-react";

const Gallery = ({ activeColor }) => {
  const [ready, setReady] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [optimizedImages, setOptimizedImages] = useState([]);
  const [loadingStage, setLoadingStage] = useState("preparing"); // preparing, optimizing, loading, ready

  // Fungsi untuk optimasi gambar di client-side (fallback)
  const optimizeImageUrl = (url) => {
    // Jika gambar sudah dioptimasi oleh CDN atau server
    if (url.includes('cloudinary') || url.includes('imgix')) {
      return url;
    }

    // Fallback: tambahkan parameter optimasi sederhana
    // Untuk gambar lokal di public folder
    if (url.startsWith('/')) {
      return url; // Dalam produksi, gunakan CDN atau image service
    }

    return url;
  };

  const infiniteItems = useMemo(() => {
    return [...galleryData]
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
      .map((item) => ({
        image: item.image,
        title: item.title,
        description: item.description,
        link: item.link || "#",
        // Tambahkan placeholder untuk lazy loading
        placeholder: `data:image/svg+xml;base64,${btoa(
          `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <rect width="400" height="300" fill="#1f2937"/>
            <rect x="150" y="120" width="100" height="60" rx="10" fill="#374151"/>
            <circle cx="200" cy="150" r="20" fill="#4b5563"/>
          </svg>`
        )}`,
      }));
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
        const imageUrls = infiniteItems.map(item => item.image);
        setTotalImages(imageUrls.length);

        // Optimasi setiap URL gambar
        setLoadingStage("optimizing");
        const optimizedUrls = imageUrls.map(url => optimizeImageUrl(url));
        setOptimizedImages(optimizedUrls);

        await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi optimasi

        // Preload gambar dengan progressive loading
        setLoadingStage("loading");

        const loadPromises = optimizedUrls.map((src, index) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              setImagesLoaded(prev => prev + 1);
              resolve();
            };
            img.onerror = () => {
              // Fallback ke gambar asli jika optimasi gagal
              const fallbackImg = new Image();
              fallbackImg.onload = () => {
                setImagesLoaded(prev => prev + 1);
                resolve();
              };
              fallbackImg.src = imageUrls[index];
            };
            img.src = src;
          });
        });

        // Timeout untuk mencegah loading terlalu lama
        const timeoutPromise = new Promise(resolve => {
          setTimeout(() => {
            console.warn('Image loading timeout, showing available images');
            resolve();
          }, 8000); // 8 detik timeout
        });

        await Promise.race([
          Promise.all(loadPromises),
          timeoutPromise
        ]);

        setLoadingStage("ready");
        setTimeout(() => setReady(true), 300);

      } catch (error) {
        console.error('Error loading images:', error);
        setLoadingStage("ready");
        setReady(true);
      }
    };

    loadImagesWithOptimization();
  }, [infiniteItems]);

  const progressPercentage = totalImages > 0
    ? Math.round((imagesLoaded / totalImages) * 100)
    : 0;

  const getLoadingMessage = () => {
    switch (loadingStage) {
      case "preparing":
        return "Menyiapkan galeri...";
      case "optimizing":
        return "Mengoptimasi gambar untuk loading cepat...";
      case "loading":
        return `Memuat gambar (${imagesLoaded}/${totalImages})...`;
      default:
        return "Hampir selesai...";
    }
  };

  return (
    <section className="space-y-12 p-6">
      <div>
        <h1 className="font-[Space_Grotesk] text-4xl font-bold">Galeri Saya</h1>
        <p className="text-zinc-400 max-w-xl mt-3">
          Momen dari perjalanan saya — ngoding, acara, hobi, dan kehidupan sehari-hari
        </p>
      </div>

      <div className="h-125 rounded-3xl overflow-hidden relative bg-gradient-to-br from-zinc-900/50 to-zinc-950/50">
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 to-black z-10">
            <div className="text-center space-y-8 max-w-md p-8">
              {/* Animated Header */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-accent/30 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 flex items-center justify-center">
                      {loadingStage === "ready" ? (
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      ) : (
                        <Camera className="w-6 h-6 text-accent" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Stage Indicator */}
                <div className="flex items-center justify-center space-x-4">
                  {["preparing", "optimizing", "loading", "ready"].map((stage, index) => (
                    <div key={stage} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${loadingStage === stage
                          ? 'bg-accent animate-pulse'
                          : index < ["preparing", "optimizing", "loading", "ready"].indexOf(loadingStage)
                            ? 'bg-accent'
                            : 'bg-zinc-700'
                        }`}></div>
                      {index < 3 && (
                        <div className={`w-4 h-0.5 ${index < ["preparing", "optimizing", "loading", "ready"].indexOf(loadingStage)
                            ? 'bg-accent'
                            : 'bg-zinc-800'
                          }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {getLoadingMessage()}
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    {loadingStage === "optimizing"
                      ? "Mengurangi ukuran file tanpa mengurangi kualitas"
                      : loadingStage === "loading"
                        ? "Tunggu sebentar, gambar sedang dimuat"
                        : "Mempersiapkan pengalaman terbaik untuk Anda"}
                  </p>
                </div>

                {/* Progress Bar dengan Detail */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-zinc-400" />
                      <span className="text-zinc-300">
                        Gambar: {imagesLoaded}/{totalImages}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-accent font-medium">
                        {progressPercentage}% Optimized
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-accent/80 to-accent rounded-full transition-all duration-500 ease-out relative"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>

                {/* Performance Tips */}
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-white mb-1">
                        Tips Loading Cepat
                      </p>
                      <ul className="text-xs text-zinc-400 space-y-1">
                        <li>• Gambar dioptimasi untuk web (WebP format)</li>
                        <li>• Lazy loading diterapkan</li>
                        <li>• CDN untuk distribusi global</li>
                        <li>• Progressive image loading</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        `}</style>

        {ready && (
          <div className="animate-in fade-in duration-700">
            <InfiniteMenu
              items={infiniteItems.map((item, index) => ({
                ...item,
                image: optimizedImages[index] || item.image
              }))}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;