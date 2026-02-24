"use client";

import { motion } from "framer-motion";
import { Star, Github } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Senior Frontend Engineer",
    text: "LynxCode didn't just speed up my workflow, it fundamentally changed how I think about building UI. I go from idea to deployed feature in minutes.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    name: "Sarah Chen",
    role: "Founder at TechFlow",
    text: "The code quality is astonishing. It's not just generating boilerplate; it's writing production-ready, accessible, and perfectly styled React components.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    name: "Marcus Johnson",
    role: "Lead Designer",
    text: "As a designer who codes, this is the bridge I've always wanted. The translation from design intent to Framer Motion animations is flawless.",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
];

export const TrustSection = () => {
  return (
    <section className="py-24 relative z-10 w-full max-w-7xl mx-auto px-6 overflow-hidden">
      
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-white/10 mb-6">
          <Github className="w-4 h-4 text-zinc-300" />
          <span className="text-sm font-medium text-zinc-300">Over 10,000+ GitHub Stars</span>
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-2xl"
        >
          Trusted by engineers who demand the best
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative p-8 rounded-2xl glass-panel glass-panel-hover overflow-hidden"
          >
            {/* Top right subtle glow on hover */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-lynx-primary/20 blur-[50px] group-hover:bg-lynx-primary/40 transition-colors duration-500 rounded-full" />
            
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-lynx-accent text-lynx-accent" />
              ))}
            </div>
            
            <p className="text-zinc-300 mb-8 leading-relaxed relative z-10">
              &quot;{t.text}&quot;
            </p>
            
            <div className="flex items-center gap-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300">
              {/* Fallback to simple div if Image fails due to domain config initially */}
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 relative group-hover:border-lynx-primary/50 transition-colors duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div>
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-sm text-zinc-500">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
