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
  const headline = ["ENGINEER", "AT", "THE", "SPEED", "OF", "THOUGHT"];

  return (
    <section className="relative min-h-screen pt-40 pb-20 overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10 w-full">
        <div className="flex flex-col gap-6 relative z-20">
          <h1 className="font-heading text-7xl md:text-8xl lg:text-[140px] leading-[0.85] text-white">
            {headline.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={textRevealVariants}
                initial="hidden"
                animate="visible"
                className="block"
                style={{
                  color:
                    i === headline.length - 1 ? "var(--lynx-primary)" : "white",
                  textShadow:
                    i === headline.length - 1
                      ? "4px 4px 0px rgba(255,255,255,1)"
                      : "none",
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="border-l-4 border-lynx-primary pl-6 py-2 mt-4"
          >
            <p className="text-lg md:text-xl text-zinc-300 font-mono max-w-xl leading-relaxed uppercase tracking-wide">
              // The interface observes you as you observe it.
              <br/>
              // Raw engineering power. AI that writes real code.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 mt-12"
          >
            <button className="px-10 py-5 bg-white text-black font-bold text-xl uppercase tracking-widest brutal-shadow flex items-center justify-center gap-3">
              <span>COMMENCE</span>
              <ArrowRight className="w-6 h-6" />
            </button>

            <button className="px-10 py-5 border-2 border-white bg-black text-white font-bold text-xl uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3 brutal-shadow">
              <Play className="w-5 h-5 fill-current" />
              <span>OVERRIDE DEMO</span>
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
