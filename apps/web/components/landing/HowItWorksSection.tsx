"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Cpu, Rocket } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    id: 1,
    title: "1. Prompt",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Describe what you want to build in plain English.",
    codeSnippet:
      "Create a responsive dashboard layout with a sidebar menu, header, and a main content area containing 3 stats cards and a chart.",
  },
  {
    id: 2,
    title: "2. AI Synthesizes",
    icon: <Cpu className="w-5 h-5" />,
    description: "Lynx context-engine plans, writes, and wires the code.",
    codeSnippet:
      "// Generating components...\n+ Sidebar.tsx (1.2kb)\n+ Header.tsx (0.8kb)\n+ StatsWidget.tsx (2.1kb)\n+ Dashboard.tsx (1.5kb)\n\n> Linking React context providers...",
  },
  {
    id: 3,
    title: "3. Deploy",
    icon: <Rocket className="w-5 h-5" />,
    description: "Review the live preview, iterate, and deploy to Vercel.",
    codeSnippet:
      '$ git add .\n$ git commit -m "feat: built dashboard view"\n$ git push origin main\n\n> Vercel Deployment Triggered\n> Status: Ready 🟢',
  },
];

export const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section
      id="how-it-works"
      className="py-24 relative z-10 w-full max-w-7xl mx-auto px-6"
    >
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white mb-4"
        >
          How it works
        </motion.h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="w-full lg:w-1/3 flex flex-col relative">
          <div className="absolute left-9.75 top-12 bottom-12 w-0.5 bg-white/10 hidden lg:block z-0">
            <motion.div
              className="w-full bg-linear-to-b from-lynx-primary to-lynx-accent"
              initial={{ height: "0%" }}
              animate={{
                height: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <div
                key={step.id}
                className={`relative pl-12 py-6 cursor-pointer transition-all duration-300 ${isActive ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div
                  className={`absolute left-0 top-7 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10
                   ${isActive ? "border-lynx-primary bg-lynx-primary/20 text-lynx-accent shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-110" : "border-white/20 bg-black text-zinc-500"}
                 `}
                >
                  {step.icon}
                </div>
                <div className="relative z-10 bg-black/40 backdrop-blur-sm p-4 -ml-4 rounded-xl border border-transparent hover:border-white/5 transition-colors">
                  <h3
                    className={`text-2xl font-semibold mb-2 transition-colors ${isActive ? "text-white" : "text-zinc-400"}`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-zinc-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-2/3 h-100">
          <div className="w-full h-full rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="h-12 border-b border-white/10 flex items-center px-4 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
              </div>
            </div>

            <div className="p-8 h-[calc(100%-3rem)] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-sm h-full"
                >
                  {activeStep === 1 && (
                    <div className="h-full flex flex-col justify-end">
                      <div className="bg-zinc-800/50 p-4 rounded-xl text-zinc-300 inline-block self-end border border-white/5 max-w-[80%] mb-4">
                        {steps[0]!.codeSnippet}
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500">
                        {/* <div className="w-8 h-8 rounded-full bg-lynx-primary/20 animate-pulse flex items-center justify-center border border-lynx-primary/30"> */}
                        <Image
                          src="/logo.svg"
                          alt="Logo"
                          width={30}
                          height={20}
                        />
                        {/* </div> */}
                        <span className="animate-pulse">Lynx is typing...</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <pre className="text-zinc-300 whitespace-pre-wrap">
                      <code
                        dangerouslySetInnerHTML={{
                          __html: steps[1]!.codeSnippet
                            .replace(
                              /\+/g,
                              '<span class="text-emerald-400">+</span>',
                            )
                            .replace(
                              />/g,
                              '<span class="text-lynx-accent">></span>',
                            ),
                        }}
                      />
                    </pre>
                  )}

                  {activeStep === 3 && (
                    <pre className="text-zinc-300 whitespace-pre-wrap">
                      <code
                        dangerouslySetInnerHTML={{
                          __html: steps[2]!.codeSnippet
                            .replace(
                              /\$/g,
                              '<span class="text-lynx-primary">$</span>',
                            )
                            .replace(
                              />/g,
                              '<span class="text-lynx-accent">></span>',
                            )
                            .replace(
                              /🟢/g,
                              '<span class="animate-pulse inline-block">🟢</span>',
                            ),
                        }}
                      />
                    </pre>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
