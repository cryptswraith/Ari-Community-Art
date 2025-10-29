import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export default function GalleryScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        {/* 3D planes/images of artworks can be placed here */}
      </Suspense>
    </Canvas>
  );
}
