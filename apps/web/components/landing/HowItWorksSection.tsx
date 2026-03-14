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
      className="py-32 relative z-10 w-full max-w-7xl mx-auto px-6"
    >
      <div className="mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-6xl md:text-8xl tracking-wider text-white mb-4"
        >
          EXECUTION_PROTOCOL
        </motion.h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="w-full lg:w-1/3 flex flex-col relative border-l-2 border-zinc-800">
          <div className="absolute -left-[2px] top-0 bottom-0 w-0.5 hidden lg:block z-0">
            <motion.div
              className="w-full bg-lynx-primary"
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
                className={`relative pl-8 py-6 cursor-pointer transition-all duration-300 ${isActive ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div
                  className={`absolute -left-2 top-8 w-4 h-4 rounded-none transition-all duration-500 z-10
                   ${isActive ? "bg-lynx-primary shadow-[0_0_15px_rgba(255,51,0,0.5)]" : "bg-zinc-800"}
                 `}
                />
                
                <div className={`relative z-10 p-4 transition-colors ${isActive ? "border-l-4 border-lynx-primary bg-white/5" : "border-l-4 border-transparent"}`}>
                  <h3
                    className={`font-heading text-3xl mb-2 transition-colors uppercase tracking-widest ${isActive ? "text-white" : "text-zinc-500"}`}
                  >
                    {step.title}
                  </h3>
                  <p className="font-mono text-sm text-zinc-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-2/3 h-100">
          <div className="w-full h-full border-2 border-zinc-800 bg-black relative">
            <div className="h-10 border-b-2 border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50">
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                Term_v2.0
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-zinc-700" />
                <div className="w-3 h-3 bg-zinc-700" />
                <div className="w-3 h-3 bg-zinc-700" />
              </div>
            </div>

            <div className="p-8 h-[calc(100%-2.5rem)] relative">
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
