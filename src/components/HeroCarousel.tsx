import { useState, useEffect } from "react";
import { Artwork } from "../types/artwork";

interface HeroCarouselProps {
  artworks: Artwork[];
}

export default function HeroCarousel({ artworks }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artworks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [artworks.length]);

  return (
    <div className="relative w-full h-[60vh] overflow-hidden rounded-lg shadow-lg">
      {artworks.map((art, index) => (
        <img
          key={art.id}
          src={art.url}
          alt={art.alt || art.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Mist overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none" />
    </div>
  );
}
