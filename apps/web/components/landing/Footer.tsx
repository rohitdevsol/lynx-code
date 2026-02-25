"use client";

import { motion } from "framer-motion";
import { TerminalSquare, Github, Twitter, DiscIcon as Discord } from "lucide-react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-black pt-20 pb-10 overflow-hidden">
      {/* Background gradients for Footer */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lynx-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-lynx-primary/10 blur-[150px] mix-blend-screen rounded-full pointer-events-none" />
      
      {/* Watermark Logo */}
      <div className="absolute -bottom-20 -right-20 text-[300px] text-white/[0.02] pointer-events-none select-none z-0 rotate-12">
        <TerminalSquare className="w-[400px] h-[400px]" strokeWidth={1} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer">
              <Image src="/logo.svg" alt="Logo" width={60} height={40} />
              <span className="font-bold text-2xl tracking-tight text-white">
                LynxCode
              </span>
            </div>
            <p className="text-zinc-400 max-w-sm text-balance">
              The AI coding platform built for engineers who care about craft.
              From prompt to production at the speed of thought.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6">Product</h3>
            <ul className="flex flex-col gap-3">
              {["Features", "Integrations", "Pricing", "Changelog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-white hover:pl-1 transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6">Resources</h3>
            <ul className="flex flex-col gap-3">
              {["Documentation", "API Reference", "Blog", "Community"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-white hover:pl-1 transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5"
        >
          <p className="text-zinc-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} LynxCode Inc. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors hover:-translate-y-1">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors hover:-translate-y-1">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors hover:-translate-y-1">
              <Discord className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to hunt better code?</h2>
          <button className="px-8 py-3 rounded-md bg-lynx-primary text-white font-medium hover:bg-lynx-primary/90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] active:scale-95">
            Start Building Free
          </button>
        </motion.div>
      </div>
    </footer>
  );
};
