"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { InteractiveTerminal } from "./InteractiveTerminal";

const textRevealVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

export const HeroSection = () => {
  const headline = ["Build", "at", "the", "speed", "of", "thought."];

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10 w-full">
        <div className="flex flex-col gap-6 relative z-20">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1]">
            {headline.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={textRevealVariants}
                initial="hidden"
                animate="visible"
                className="inline-block mr-4 md:mr-5 lg:mr-6"
                style={{
                  color:
                    i === headline.length - 1 ? "var(--lynx-primary)" : "white",
                  textShadow:
                    i === headline.length - 1
                      ? "0 0 30px rgba(139, 92, 246, 0.5)"
                      : "none",
                }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block w-0.75 h-17.5 bg-lynx-accent ml-2 translate-y-2 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-xl md:text-2xl text-zinc-400 font-medium max-w-xl leading-relaxed"
          >
            The interface is observing you as you observe it. From prompt to
            production, AI that writes real code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <button className="group relative px-8 py-4 rounded-lg bg-white text-black font-semibold text-lg overflow-hidden transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              <span className="relative z-10 flex items-center gap-2">
                Start Building{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-lynx-primary/20 to-lynx-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button className="group px-8 py-4 rounded-lg border border-white/10 bg-black/40 backdrop-blur-md text-white font-semibold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-lynx-primary transition-colors">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </span>
              View Demo
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1, type: "spring", bounce: 0.4 }}
          className="relative z-10 lg:ml-auto w-full lg:w-[120%]"
        >
          <div className="absolute -inset-4 bg-lynx-primary/20 blur-[100px] rounded-full z-[-1] pointer-events-none" />
          <InteractiveTerminal />
        </motion.div>
      </div>
    </section>
  );
};
