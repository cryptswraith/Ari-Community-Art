// src/App.tsx
import React, { useRef, useEffect, useState } from "react";
import Scene3D from "./components/Scene3D";
import ArtCard from "./components/ArtCard";
import HeroSection from "./components/HeroSection";
import { motion, useAnimation } from "framer-motion";
import type { Artwork } from "./types/artwork";

const featuredArt: Artwork[] = [
  { id: 101, url: "/featured/art1.jpg", title: "Echoes of the Forgotten", description: "A haunting reflection of the fading digital souls.", alt: "haunting digital artwork", artist: "Psyche", reason: "Created to represent how forgotten memories linger in the digital realm." },
  { id: 102, url: "/featured/art2.jpg", title: "Synthetic Dreams", description: "Neon spirits trapped in synthetic light.", alt: "neon spirits artwork", artist: "Psyche", reason: "Expresses the tension between AI-generated worlds and human imagination." },
  { id: 103, url: "/featured/art3.jpg", title: "Fragments of Arichain", description: "When the blockchain remembers what humanity forgets.", alt: "blockchain fragments", artist: "Psyche", reason: "Shows the interplay of memory and data permanence on Arichain." },
];

const communityArts: Artwork[] = [
  { id: 201, url: "/community/art1.jpg", title: "Vault Entrance", description: "A mysterious gateway.", alt: "vault artwork" },
  { id: 202, url: "/community/art2.jpg", title: "Digital Frame", description: "Neon memories framed.", alt: "digital frame" },
  { id: 203, url: "/community/art3.jpg", title: "Neon Grid", description: "Networked light.", alt: "neon grid" },
];

export default function App() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const controls = useAnimation();

  const [hasEntered, setHasEntered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [fadeScene, setFadeScene] = useState(0);

  // 🧱 Lock scroll until user enters
  useEffect(() => {
    document.body.style.overflow = hasEntered ? "auto" : "hidden";
  }, [hasEntered]);

  // 🌀 Scroll tracking (mobile-friendly)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (!hasEntered) return;
      const viewH = el.clientHeight; // ✅ works better on mobile than window.innerHeight
      const index = Math.round(el.scrollTop / viewH);
      setScrollIndex(index);
      const progress = el.scrollTop / (viewH * (featuredArt.length + 1));
      setFadeScene(Math.min(1, progress * 1.2));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasEntered]);

  // 🚪 Cinematic enter
  const handleEnter = async () => {
    if (transitioning) return;
    setTransitioning(true);

    await controls.start({
      opacity: [0, 1],
      transition: { duration: 0.8, ease: "easeInOut" },
    });

    setTimeout(() => {
      setHasEntered(true);
      const el = scrollRef.current;
      if (el) {
        el.scrollTo({ top: el.clientHeight, behavior: "smooth" });
      }
    }, 800);

    const el = scrollRef.current;
    if (el) {
      const checkScrollEnd = () => {
        const nearTarget = Math.abs(el.scrollTop - el.clientHeight) < 10;
        if (nearTarget) {
          setTimeout(() => setTransitioning(false), 1000);
          el.removeEventListener("scroll", checkScrollEnd);
        }
      };
      el.addEventListener("scroll", checkScrollEnd);
    } else {
      setTimeout(() => setTransitioning(false), 2000);
    }
  };

  return (
  <div
    ref={scrollRef}
    className={`w-full h-screen snap-y snap-mandatory scroll-smooth bg-black text-white transition-all duration-500 
      ${hasEntered ? "overflow-y-scroll" : "overflow-hidden"}`}
    style={{
      WebkitOverflowScrolling: "touch",
      overscrollBehaviorY: "contain",
      touchAction: "pan-y",
      height: "100dvh", // ✅ fix viewport jump in mobile Chrome
    }}
    onTouchMove={(e) => {
      if (!hasEntered) return;
      e.stopPropagation();
    }}
  >
      {/* === 3D Scene === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hasEntered ? fadeScene : 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <Scene3D scrollIndex={scrollIndex} hasEntered={hasEntered} />
        </motion.div>
      </div>

      {/* === Bloody Overlay === */}
      {transitioning && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden touch-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.8, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#200000] via-[#400000]/50 to-transparent"
            animate={{
              opacity: [0.2, 0.6, 0.4, 0],
              scaleY: [1.2, 1, 1, 1.3],
            }}
            transition={{ duration: 3.8, ease: "easeInOut" }}
          />

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[1.5px] bg-red-700/70 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * -50}px`,
                  height: `${50 + Math.random() * 120}px`,
                }}
                animate={{
                  y: [0, 900],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2.8 + Math.random() * 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 1.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          <motion.h1
            className="text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-widest text-center relative px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [20, 0, 0, -40],
            }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
          >
            <span className="bloody-text">UNSEALING THE VAULT...</span>
          </motion.h1>

          <style>{`
            .bloody-text {
              color: #ff1a1a;
              position: relative;
              text-shadow:
                0 0 15px rgba(255,0,0,0.6),
                0 0 30px rgba(150,0,0,0.4);
              animation: bleedGlow 2.8s ease-in-out infinite alternate;
            }
            .bloody-text::after {
              content: "";
              position: absolute;
              left: 50%;
              bottom: -8px;
              width: 6px;
              height: 20px;
              border-radius: 50%;
              background: linear-gradient(to bottom, #ff0000, #600000);
              transform: translateX(-50%);
              animation: drip 1.8s ease-in-out infinite;
            }
            @keyframes drip {
              0% { opacity: 0; transform: translate(-50%, 0); height: 0px; }
              30% { opacity: 1; height: 10px; }
              60% { height: 25px; transform: translate(-50%, 15px); }
              100% { opacity: 0; transform: translate(-50%, 40px); }
            }
            @keyframes bleedGlow {
              0% { text-shadow: 0 0 8px rgba(255,0,0,0.4), 0 0 25px rgba(255,30,30,0.6); }
              50% { text-shadow: 0 0 25px rgba(255,20,20,0.8), 0 0 50px rgba(255,0,0,0.4); }
              100% { text-shadow: 0 0 10px rgba(255,0,0,0.5), 0 0 30px rgba(180,0,0,0.4); }
            }
          `}</style>
        </motion.div>
      )}

      {/* === Hero Section === */}
      <section className="snap-start h-screen flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: hasEntered || transitioning ? 0 : 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <HeroSection onEnter={handleEnter} isVisible={!hasEntered && scrollIndex === 0} />
        </motion.div>
      </section>

      {/* === Featured Art === */}
      {featuredArt.map((art, index) => (
        <section
          key={art.id}
          className="snap-start min-h-screen flex flex-col items-center justify-center relative z-10 px-4 md:px-8"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-red-900/20 to-black/60 pointer-events-none"
            style={{ opacity: 0.4 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={scrollIndex === index + 1 && !transitioning ? { opacity: 1, y: 0, scale: 1.05 } : { opacity: 0, y: 80, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="w-full max-w-md sm:max-w-lg md:max-w-xl"
          >
            <ArtCard art={art} />
            <p className="text-gray-400 mt-4 italic text-sm sm:text-base">{art.reason}</p>
          </motion.div>
        </section>
      ))}

      {/* === Community Section === */}
      <section className="snap-start min-h-screen flex flex-col items-center justify-start relative z-10 py-12 px-4">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-black/40 to-transparent pointer-events-none"
          animate={{
            opacity: scrollIndex >= featuredArt.length + 1 && !transitioning ? 0.8 : 0.3,
          }}
          transition={{ duration: 1 }}
        />
        <motion.h1
          className="text-[clamp(2rem,6vw,3.5rem)] font-bold text-red-500 drop-shadow-[0_0_20px_#ff0000] mb-8 text-center"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          COMMUNITY GALLERY
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={scrollIndex === featuredArt.length + 1 && !transitioning ? { opacity: 1, y: 0, scale: 1.05 } : { opacity: 0, y: 50, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[95vw] justify-items-center"
        >
          {communityArts.map((art, i) => (
            <motion.div
              key={`${art.title}-${i}`}
              whileHover={{ scale: 1.05 }}
              className="transition-transform duration-500 w-full max-w-xs sm:max-w-sm"
            >
              <ArtCard art={art} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
