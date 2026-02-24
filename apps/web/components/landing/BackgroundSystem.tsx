"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const BackgroundSystem = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-noise z-10" />

      {/* Grid Overlay with perspective */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
          transform: "perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)",
          transformOrigin: "top center",
        }}
      />

      {/* Soft Radial Glow following cursor */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full point-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 70%)",
        }}
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          mass: 0.5,
        }}
      />
      
      {/* Ambient static glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lynx-primary/10 blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-lynx-accent/10 blur-[150px] mix-blend-screen" />

    </div>
  );
};
