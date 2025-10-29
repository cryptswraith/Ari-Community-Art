// src/components/HeroSection.tsx
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "@fontsource/cinzel-decorative";

interface HeroSectionProps {
  onEnter: () => void;
  isVisible: boolean;
}

export default function HeroSection({ onEnter, isVisible }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mounted = true;
    let animationFrame = 0;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      if (!canvas) return;
      const w = Math.max(320, window.innerWidth);
      const h = Math.max(320, window.innerHeight);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const img = new Image();
    img.src = "/logo-arichain.png";

    const isMobile = window.innerWidth < 768;
    const LOGO_COUNT = isMobile ? 12 : 24;

    const logos = Array.from({ length: LOGO_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: (isMobile ? 20 : 30) + Math.random() * (isMobile ? 18 : 28),
      tilt: Math.random() * Math.PI * 2,
      rotSpeed: 0.01 + Math.random() * 0.02,
      fallSpeed: 0.6 + Math.random() * 0.6,
      swing: Math.random() * 1.2 + 0.5,
      alpha: 1,
    }));

    let frame = 0;
    let fadeOut = false;
    let lastTick = performance.now();
    const targetFPS = isMobile ? 30 : 60;
    const frameDuration = 1000 / targetFPS;

    const draw = (now: number) => {
      if (!mounted) return;
      const dt = now - lastTick;
      if (dt < frameDuration) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }
      lastTick = now;

      const width = canvas.width / DPR;
      const height = canvas.height / DPR;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      logos.forEach((p) => {
        p.y += p.fallSpeed;
        p.x += Math.sin(p.tilt) * p.swing;
        p.tilt += p.rotSpeed;

        if (fadeOut) p.alpha *= 0.96;
        if (p.y > height + 50 && !fadeOut) {
          p.y = -30;
          p.x = Math.random() * width;
          p.alpha = 1;
        }

        if (img.complete) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.tilt * 0.28);
          ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

          const t = Math.sin((frame + p.x) * 0.008);
          const r1 = Math.round(130 + t * 40);
          const r2 = Math.round(230 - t * 30);
          const g1 = Math.round(10 + t * 10);
          const g2 = Math.round(30 + t * 10);

          const gradient = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
          gradient.addColorStop(0, `rgba(${r1},${g1},${g1},0.95)`);
          gradient.addColorStop(1, `rgba(${r2},${g2},${g2},0.85)`);
          ctx.fillStyle = gradient;

          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.globalCompositeOperation = "source-atop";
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

          ctx.shadowBlur = isMobile ? 8 : 14;
          ctx.shadowColor = "rgba(200,30,30,0.25)";
          ctx.restore();
        }
      });

      frame++;
      if (frame === Math.floor((isMobile ? 30 : 60) * 7)) fadeOut = true;

      if (fadeOut && logos.every((p) => p.alpha < 0.02)) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);

    return () => {
      mounted = false;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible]);

  // ✅ FIX: Jangan matikan scroll di mobile
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.documentElement.style.touchAction;

    if (isVisible) {
      if (window.innerWidth >= 768) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.touchAction = "none";
      } else {
        document.body.style.overflow = "auto";
        document.documentElement.style.touchAction = "auto";
      }
    } else {
      document.body.style.overflow = prevOverflow || "auto";
      document.documentElement.style.touchAction = prevTouch || "auto";
    }

    return () => {
      document.body.style.overflow = prevOverflow || "auto";
      document.documentElement.style.touchAction = prevTouch || "auto";
    };
  }, [isVisible]);

  return (
    <motion.section
      className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-screen"
      />

      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 0.36 : 0 }}
        transition={{ duration: 1.8 }}
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(160,0,0,0.14), transparent 70%)",
        }}
      />

      <motion.div
        className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-screen"
        animate={{ opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h1
        className="relative font-['Cinzel_Decorative'] text-[clamp(1.75rem,6vw,4.5rem)] font-bold text-[#b30000] text-center leading-tight select-none px-4 z-10"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={
          isVisible
            ? {
                opacity: [0, 1, 0.96, 1],
                scale: [0.92, 1.02, 1.0],
                textShadow: [
                  "0 0 5px #660000",
                  "0 0 12px #800000",
                  "0 0 8px #990000",
                ],
              }
            : { opacity: 0, scale: 0.92 }
        }
        transition={{ duration: 2.0, ease: "easeInOut" }}
        style={{ WebkitTextStroke: "0.35px rgba(0,0,0,0.15)" }}
      >
        Community Art
      </motion.h1>

      <motion.p
        className="mt-4 text-gray-300 text-center text-[clamp(0.9rem,2.2vw,1.05rem)] font-light tracking-wide z-10 px-6"
        initial={{ opacity: 0, y: 18 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ delay: 1.1, duration: 1.1, ease: "easeOut" }}
      >
        Where shadows preserve the art of the forgotten.
      </motion.p>

      <motion.button
        onClick={onEnter}
        className="relative mt-8 px-6 sm:px-8 py-2 sm:py-3 rounded-full bg-[#8b0000] text-white font-semibold text-base sm:text-lg shadow-[0_0_10px_rgba(77,0,0,0.8)] hover:bg-[#a30000] transition-all duration-300 z-10 overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ delay: 2, duration: 0.9 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="relative z-10">Enter the Museum</span>
        <motion.div
          className="absolute inset-0 rounded-full bg-[#ff0000] blur-xl opacity-20"
          animate={{ opacity: [0.12, 0.32, 0.12], scale: [1, 1.02, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.button>
    </motion.section>
  );
}
