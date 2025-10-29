import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Artwork } from "../types/artwork";

interface ArtCardProps {
  art: Artwork;
}

export default function ArtCard({ art }: ArtCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 🔍 Deteksi orientasi gambar
  useEffect(() => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    img.onload = () => setIsPortrait(img.naturalHeight > img.naturalWidth);
  }, [art.url]);

  // ⚡ Efek glitch acak saat modal terbuka
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 250);
    }, 2500 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, [isOpen]);

  // ❌ Klik luar modal untuk close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* === Thumbnail === */}
      <motion.div
        layoutId={`card-${art.id}`}
        className="bg-black/70 rounded-2xl border border-red-800 shadow-[0_0_20px_rgba(255,0,0,0.4)] overflow-hidden cursor-pointer backdrop-blur-sm hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] transition-all duration-500 touch-manipulation"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
      >
        <motion.img
          src={art.url}
          alt={art.alt}
          ref={imgRef}
          className="w-full h-[280px] sm:h-[320px] md:h-[380px] object-cover rounded-t-2xl"
          layoutId={`image-${art.id}`}
          loading="lazy"
          draggable={false}
        />
        <div className="p-4 sm:p-5">
          <h3 className="text-[clamp(1rem,3vw,1.25rem)] font-bold text-red-500 mb-1">
            {art.title}
          </h3>
          <p className="text-gray-400 text-[clamp(0.8rem,2.4vw,1rem)] leading-snug">
            {art.description}
          </p>
        </div>
      </motion.div>

      {/* === Modal === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] px-3 sm:px-6 overflow-y-auto"
            style={{
              touchAction: "pan-y", // ✅ allow scroll on mobile
              WebkitOverflowScrolling: "touch", // ✅ smooth scroll iOS
            }}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              layoutId={`card-${art.id}`}
              className={`relative w-full max-w-[95vw] sm:max-w-4xl md:max-w-6xl rounded-3xl border border-red-700 bg-black/60 shadow-[0_0_50px_rgba(255,0,0,0.6)] overflow-hidden transition-all duration-300 ${
                glitchActive ? "glitch-active" : ""
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* 🖼️ Gambar */}
              <motion.img
                src={art.url}
                alt={art.alt}
                layoutId={`image-${art.id}`}
                className={`w-full max-h-[80vh] ${
                  isPortrait ? "object-contain" : "object-cover"
                } object-center rounded-t-3xl transition-all duration-300 ${
                  glitchActive ? "glitch-img" : ""
                }`}
                draggable={false}
              />

              {/* 🌫️ Efek layer */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_60%,rgba(0,0,0,0.7))]" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay grain-layer" />

              {/* 🧠 Info Section */}
              <div className="p-4 sm:p-6 text-center bg-black/70 border-t border-red-800">
                <h2 className="text-[clamp(1.25rem,4vw,2rem)] font-bold text-red-500 mb-2 leading-tight">
                  {art.title}
                </h2>
                <p className="text-gray-300 mb-3 text-[clamp(0.9rem,2.6vw,1rem)] leading-relaxed">
                  {art.description}
                </p>
                {art.reason && (
                  <p className="text-gray-500 text-sm italic">{art.reason}</p>
                )}
              </div>

              {/* ❌ Tombol Close */}
              <motion.button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-5 text-red-500 hover:text-white text-2xl sm:text-3xl font-bold"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </motion.div>

            {/* === CSS Animasi === */}
            <style>{`
              .glitch-img {
                filter: contrast(1.25) brightness(1.1) saturate(1.4);
                animation: rgbShift 0.25s steps(2, end) infinite alternate;
              }
              .glitch-active {
                animation: glitchFlash 0.25s ease-in-out;
              }
              .grain-layer {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8WQ8AAsABQXcM0X8AAAAASUVORK5CYII=");
                background-repeat: repeat;
                animation: grainMove 1.5s steps(2) infinite;
              }
              @keyframes grainMove {
                0% { transform: translate(0,0); }
                100% { transform: translate(-1%, 1%); }
              }
              @keyframes rgbShift {
                0% { transform: translate(0,0); filter: hue-rotate(0deg); }
                25% { transform: translate(2px,-2px); filter: hue-rotate(10deg) saturate(1.5); }
                50% { transform: translate(-2px,1px); filter: hue-rotate(-15deg) saturate(1.6); }
                75% { transform: translate(1px,2px); filter: hue-rotate(12deg) saturate(1.5); }
                100% { transform: translate(0,0); }
              }
              @keyframes glitchFlash {
                0% { box-shadow: 0 0 40px rgba(255,0,0,0.5); }
                50% { box-shadow: 0 0 80px rgba(255,80,80,0.9); }
                100% { box-shadow: 0 0 40px rgba(255,0,0,0.5); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
