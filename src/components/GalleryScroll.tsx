import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import ArtCardMuseumFinal from "../components/ArtCard";
import { Artwork, artworks } from "../types/artwork";

export default function GalleryScrollFinal() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const index = Math.round(el.scrollTop / window.innerHeight);
      setScrollIndex(index);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [scrollIndex, controls]);

  return (
    <div
  ref={scrollRef}
  className="w-full h-dvh overflow-y-auto snap-y snap-mandatory scroll-smooth bg-black text-white touch-pan-y"
  style={{
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain",
  }}
>
      {/* Featured Art 1-3 */}
      {artworks.slice(0, 3).map((art: Artwork, i: number) => (
        <section
          key={art.id}
          className="snap-start h-screen flex flex-col items-center justify-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={scrollIndex === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <ArtCardMuseumFinal art={art} />
          </motion.div>
        </section>
      ))}

      {/* Community Museum 4 */}
      <section className="snap-start h-screen flex flex-col justify-center items-center relative z-10">
        <h1 className="text-5xl font-bold mb-8 text-red-500 drop-shadow-[0_0_15px_#ff0000]">
          Community Museum
        </h1>
        <div className="flex overflow-x-auto space-x-6 p-6 scrollbar-none snap-x snap-mandatory w-full max-w-5xl">
          {artworks.slice(3).map((art: Artwork, i: number) => (
            <div
              key={art.id}
              className="snap-center flex-shrink-0 transition-transform duration-500 hover:scale-105"
              style={{ minWidth: 320 }}
            >
              <ArtCardMuseumFinal art={art} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
