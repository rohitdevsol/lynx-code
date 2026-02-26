"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  Settings,
  UserCircle,
  Bell,
} from "lucide-react";

export const LiveDemoSection = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [promptText, setPromptText] = useState("");
  const fullPrompt =
    "Create a modern settings dashboard with a sidebar menu, user profile section, and notification preferences toggles. Use a dark theme with glassmorphism.";

  const handleGenerate = () => {
    if (isGenerating || showResult) return;

    setIsGenerating(true);
    setPromptText("");

    // Simulate typing
    let i = 0;
    const typingInterval = setInterval(() => {
      setPromptText(fullPrompt.slice(0, i));
      i++;
      if (i > fullPrompt.length) {
        clearInterval(typingInterval);

        // Simulate generation delay
        setTimeout(() => {
          setIsGenerating(false);
          setShowResult(true);
        }, 1500);
      }
    }, 40);
  };

  const handleReset = () => {
    setShowResult(false);
    setPromptText("");
  };

  return (
    <section className="py-24 relative w-full max-w-7xl mx-auto px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-lynx-primary/5 blur-[120px] rounded-full pointer-events-none z-[-1]" />

      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white mb-4"
        >
          See it in action
        </motion.h2>
        <p className="text-zinc-400">
          Experience the speed of AI-driven UI creation.
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-150">
          {/* Left Side: Prompt Area */}
          <div className="p-8 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between bg-black/20">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-lynx-primary" />
                <h3 className="text-lg font-medium text-white">AI Builder</h3>
              </div>

              <div className="relative group">
                {/* Focus glow effect */}
                <div
                  className={`absolute -inset-0.5 bg-linear-to-r from-lynx-primary/50 to-lynx-accent/50 rounded-xl blur opacity-0 transition duration-500 ${isGenerating && !showResult ? "opacity-100" : "group-hover:opacity-30"}`}
                />

                <div className="relative bg-zinc-900/80 border border-white/10 rounded-xl p-4 min-h-37.5 cursor-text">
                  <p className="text-zinc-300 min-h-25 font-medium leading-relaxed">
                    {promptText}
                    {isGenerating && (
                      <span className="inline-block w-2 h-4 bg-lynx-primary ml-1 animate-pulse translate-y-1" />
                    )}
                    {!isGenerating &&
                      !showResult &&
                      promptText.length === 0 && (
                        <span className="text-zinc-600">
                          Describe the UI you want to build...
                        </span>
                      )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {!showResult ? (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                >
                  {isGenerating ? "Synthesizing..." : "Generate UI"}
                  {!isGenerating && <ArrowRight className="w-4 h-4" />}
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full py-4 rounded-xl bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors border border-white/10"
                >
                  Build Another
                </button>
              )}
            </div>
          </div>

          {/* Right Side: Preview Area */}
          <div className="relative bg-[#0c0c0e] overflow-hidden flex items-center justify-center p-6">
            <div className="absolute inset-0 pattern-grid-lg text-white/2" />

            <AnimatePresence mode="wait">
              {!isGenerating && !showResult && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-zinc-600 flex flex-col items-center gap-4"
                >
                  <LayoutDashboard className="w-12 h-12 opacity-50" />
                  <p>Preview will appear here</p>
                </motion.div>
              )}

              {isGenerating && !showResult && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center gap-6"
                >
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-t-2 border-lynx-primary animate-spin" />
                    <div className="absolute inset-2 rounded-full border-r-2 border-lynx-accent animate-spin-slow" />
                    <div className="absolute inset-4 rounded-full border-l-2 border-white/20 animate-spin-reverse" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-lynx-primary animate-pulse" />
                  </div>
                  <div className="flex flex-col items-center text-sm font-mono text-zinc-400 gap-1">
                    <span className="animate-pulse">
                      &gt; Compiling components...
                    </span>
                    <span className="animate-pulse delay-75">
                      &gt; Generating styles...
                    </span>
                  </div>
                </motion.div>
              )}

              {showResult && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="w-full h-full bg-zinc-950 rounded-xl border border-white/10 overflow-hidden flex shadow-2xl"
                >
                  {/* Generated UI Mock */}
                  <div className="w-48 bg-black border-r border-white/5 p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded bg-lynx-primary" />
                      <span className="font-semibold text-sm">Dashboard</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        "Profile",
                        "Account",
                        "Appearance",
                        "Notifications",
                      ].map((item, i) => (
                        <div
                          key={item}
                          className={`px-3 py-2 rounded-md text-sm ${i === 3 ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 p-6 bg-zinc-950/50 flex flex-col gap-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <h4 className="font-medium text-lg">Notifications</h4>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-md bg-white/5 hover:bg-white/10">
                          <Bell className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-lynx-primary/20 flex items-center justify-center border border-lynx-primary/30">
                          <UserCircle className="w-5 h-5 text-lynx-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {[
                        {
                          title: "Email Alerts",
                          desc: "Receive daily summary emails",
                        },
                        {
                          title: "Push Notifications",
                          desc: "Instant alerts on desktop",
                        },
                        {
                          title: "Slack Integration",
                          desc: "Send alerts to #dev-team",
                        },
                      ].map((setting, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5"
                        >
                          <div>
                            <div className="font-medium text-sm text-zinc-200">
                              {setting.title}
                            </div>
                            <div className="text-xs text-zinc-500">
                              {setting.desc}
                            </div>
                          </div>
                          <div
                            className={`w-10 h-6 rounded-full p-1 transition-colors ${i < 2 ? "bg-lynx-primary" : "bg-zinc-700"}`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${i < 2 ? "translate-x-4" : "translate-x-0"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
