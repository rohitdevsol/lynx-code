"use client";

import { motion } from "framer-motion";
import { Zap, Layers, Eye, Wand2, GitBranch, Users } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Generation",
    description: "Write a prompt, get a full working component in milliseconds. No more boilerplate.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Multi-file Editing",
    description: "Complex features require complex context. We edit across your entire codebase safely.",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Live Preview",
    description: "See your UI changes stream in real-time. Instantly interact with the generated code.",
  },
  {
    icon: <Wand2 className="w-6 h-6" />,
    title: "AI Refactoring",
    description: "Highlight messy code and let the AI rewrite it to your team's exact standards.",
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "GitHub Sync",
    description: "Deploy directly to your repository with auto-generated sensible commit messages.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Real-time Collab",
    description: "Code alongside your team and AI agents in the same multiplayer workspace.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative z-10 w-full max-w-7xl mx-auto px-6">
      <div className="mb-16 text-center md:text-left">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
        >
          Everything you need to ship faster.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-zinc-400 max-w-2xl"
        >
          Built from the ground up to integrate seamlessly into modern developer workflows.
        </motion.p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group relative p-8 rounded-2xl glass-panel glass-panel-hover"
          >
            {/* Dynamic Hover Glow Array */}
            <div className="absolute inset-0 bg-gradient-to-br from-lynx-primary/0 to-lynx-accent/0 group-hover:from-lynx-primary/10 group-hover:to-lynx-accent/5 rounded-2xl transition-all duration-500 pointer-events-none" />
            
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-zinc-300 group-hover:text-lynx-accent group-hover:scale-110 group-hover:border-lynx-accent/30 transition-all duration-300 shadow-[0_0_0_transparent] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              {feature.icon}
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:-translate-y-0.5 transition-transform duration-300">
              {feature.title}
            </h3>
            
            <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
