"use client";

import { motion } from "framer-motion";
import { Zap, Layers, Eye, Wand2, GitBranch, Users } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Generation",
    description:
      "Write a prompt, get a full working component in milliseconds. No more boilerplate.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Multi-file Editing",
    description:
      "Complex features require complex context. We edit across your entire codebase safely.",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Live Preview",
    description:
      "See your UI changes stream in real-time. Instantly interact with the generated code.",
  },
  {
    icon: <Wand2 className="w-6 h-6" />,
    title: "AI Refactoring",
    description:
      "Highlight messy code and let the AI rewrite it to your team's exact standards.",
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "GitHub Sync",
    description:
      "Deploy directly to your repository with auto-generated sensible commit messages.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Real-time Collab",
    description:
      "Code alongside your team and AI agents in the same multiplayer workspace.",
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
    <section
      id="features"
      className="py-32 relative z-10 w-full max-w-7xl mx-auto px-6 border-t-2 border-white"
    >
      <div className="mb-16 md:flex justify-between items-end">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-6xl md:text-8xl tracking-wider text-white mb-4 md:mb-0"
        >
          SYS_CAPABILITIES
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-lynx-primary font-mono max-w-md uppercase"
        >
          // Built from the ground up for raw performance and unyielding developer velocity.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-zinc-800"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group relative p-8 border-r border-b border-zinc-800 hover:bg-white/5 transition-colors"
          >
            <div className="text-4xl font-heading text-zinc-900 absolute top-4 right-4 group-hover:text-lynx-primary transition-colors select-none">
              0{index + 1}
            </div>
            
            <div className="mb-6 text-white">
              {feature.icon}
            </div>

            <h3 className="font-heading text-3xl text-white mb-3 tracking-wide">
              {feature.title}
            </h3>

            <p className="font-mono text-sm text-zinc-400 leading-relaxed max-w-xs">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
