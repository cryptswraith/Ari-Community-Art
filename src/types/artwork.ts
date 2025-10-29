export interface Artwork {
  id: number;
  url: string;           // wajib
  alt?: string;          // optional
  title: string;         // wajib
  artist?: string;       // optional
  description?: string;  // optional
  reason?: string;       // optional
}

// Export array artworks
export const artworks: Artwork[] = [
  {
    id: 1,
    url: "/assets/art1.jpg",
    title: "Echoes of the Forgotten",
    description: "A haunting reflection of the fading digital souls.",
    reason: "Menggambarkan hilangnya jejak digital manusia",
  },
  {
    id: 2,
    url: "/assets/art2.jpg",
    title: "Fragments of Arichain",
    description: "When the blockchain remembers what humanity forgets.",
    reason: "Blockchain menyimpan ingatan digital",
  },
  {
    id: 3,
    url: "/assets/art3.jpg",
    title: "Synthetic Dreams",
    description: "Neon spirits trapped in synthetic light.",
    reason: "Mimpi sintetis di dunia neon",
  },
  {
    id: 4,
    url: "/assets/art4.jpg",
    title: "Community Spirit",
    description: "Art from Arichain community.",
    reason: "Highlight karya komunitas",
  },
];
