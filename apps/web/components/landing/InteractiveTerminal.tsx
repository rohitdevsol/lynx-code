"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const codeLines = [
  { type: "comment", content: "// Analyzing natural language prompt..." },
  {
    type: "system",
    content: "> Generating Next.js components and Tailwind styles",
  },
  { type: "code", content: "export const LandingPage = () => {" },
  { type: "code", content: "  return (" },
  {
    type: "code",
    content: '    <main className="bg-background text-foreground">',
  },
  { type: "diff-add", content: '+      <HeroSection animation="spring" />' },
  { type: "diff-add", content: "+      <FeaturesGrid stagger={0.1} />" },
  { type: "code", content: "      <Footer />" },
  { type: "code", content: "    </main>" },
  { type: "code", content: "  );" },
  { type: "code", content: "};" },
  {
    type: "success",
    content: "> ⚡ Build complete in 142ms. Ready for preview.",
  },
];

export const InteractiveTerminal = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax/Tilt effect state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const streamCode = () => {
      setVisibleLines((prev) => {
        if (prev < codeLines.length) {
          const nextLine = codeLines[prev];
          if (!nextLine) return prev;
          const delay =
            nextLine.type === "comment" || nextLine.type === "system"
              ? 800
              : nextLine.type === "success"
                ? 1200
                : 200;
          timeout = setTimeout(streamCode, delay);
          return prev + 1;
        }
        return prev;
      });
    };

    timeout = setTimeout(streamCode, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full rounded-xl border border-white/10 glass-panel shadow-2xl overflow-hidden group"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 backdrop-blur-md">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-xs font-mono text-zinc-400 select-none">
          lynx-ai-session ~ node
        </div>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Terminal Body */}
      <div className="p-6 font-mono text-sm leading-relaxed overflow-hidden bg-black/40 min-h-85 relative">
        {/* Dynamic Gradient shift on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-lynx-primary/5 to-lynx-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-1">
          {codeLines.slice(0, visibleLines).map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`
                ${line.type === "comment" ? "text-zinc-500" : ""}
                ${line.type === "system" ? "text-lynx-accent" : ""}
                ${line.type === "code" ? "text-zinc-300" : ""}
                ${line.type === "diff-add" ? "text-emerald-400 bg-emerald-500/10 px-2 -mx-2 rounded" : ""}
                ${line.type === "success" ? "text-green-400 mt-4" : ""}
              `}
            >
              <span className="opacity-40 mr-4 select-none inline-block w-4 text-right">
                {line.type === "code" || line.type === "diff-add"
                  ? idx + 1
                  : ""}
              </span>
              {line.content}
            </motion.div>
          ))}
          {visibleLines < codeLines.length && (
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2.5 h-4 bg-zinc-300 ml-8 mt-1 inline-block"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};
