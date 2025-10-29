import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
}

export default function ParticleBurst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const lastSpawn = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#ff0000", "#cc2222", "#ff5555", "#ff9999"];

    const spawnParticles = (x: number, y: number) => {
      for (let i = 0; i < 15; i++) {
        particles.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          r: Math.random() * 2.5 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 60 + Math.random() * 30,
        });
      }
    };

    const handleMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      const now = performance.now();
      // spawn kecil tiap 100ms agar smooth
      if (now - lastSpawn.current > 100) {
        spawnParticles(e.clientX, e.clientY);
        lastSpawn.current = now;
      }
    };
    window.addEventListener("mousemove", handleMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // slowdown elegan
        p.vy *= 0.96;
        p.life--;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(p.life / 100, 0);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fill();
      });

      particles.current = particles.current.filter((p) => p.life > 0);
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40 pointer-events-none"
    />
  );
}
