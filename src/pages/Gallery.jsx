import { useState, useEffect, useMemo } from "react";
import { galleryData } from "../data/galleryData";
import InfiniteMenu from "../components/ui/InfiniteMenu";

const Gallery = ({ activeColor }) => {
  const [ready, setReady] = useState(false);

  const infiniteItems = useMemo(() => {
    return [...galleryData]
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
      .map((item) => ({
        image: item.image,
        title: item.title,
        description: item.description,
        link: item.link || "#",
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
    const t = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="space-y-12 p-6">
      <div>
        <h1 className="font-[Space_Grotesk] text-4xl font-bold">My Gallery</h1>
        <p className="text-zinc-400 max-w-xl mt-3">Moments from my journey — coding, events, hobbies, and daily life.</p>
      </div>

      <div className="h-[500px] rounded-3xl overflow-hidden relative">
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/60 backdrop-blur">
            <p className="text-sm text-zinc-400 animate-pulse">Loading gallery...</p>
          </div>
        )}

        {ready && <InfiniteMenu items={infiniteItems} />}
      </div>
    </section>
  );
};

export default Gallery;
