"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, TerminalSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [isSigniningIn, setIsSigniningIn] = useState(false);

  const handleGitHubLogin = async () => {
    setIsSigniningIn(true);
    try {
      await authClient.signIn.social(
        {
          provider: "github",
          scopes: ["repo", "read:user", "user:email"],
          callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL!,
        },
        {
          onSuccess: () => {
            setIsSigniningIn(false);
          },
          onError: () => {
            toast.error("Login failed");
            setIsSigniningIn(false);
          },
        },
      );
    } catch (error) {
      console.error("Login failed:", error);
      setIsSigniningIn(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-6 selection:bg-lynx-primary/30 selection:text-white">
      <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
        <div className="absolute inset-0 bg-noise z-10 opacity-30" />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lynx-primary/20 blur-[150px] mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-lynx-accent/20 blur-[180px] mix-blend-screen"
        />

        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "4rem 4rem",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="absolute -inset-[1px] bg-gradient-to-b from-lynx-primary/40 to-white/5 rounded-2xl blur-sm opacity-50" />

        <div className="relative glass-panel rounded-2xl p-10 flex flex-col items-center">
          <Image
            src="/logo.svg"
            className="mb-8"
            alt="Logo"
            width={60}
            height={40}
          />

          <div className="text-center mb-10 w-full relative">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-zinc-400 text-sm max-w-[280px] mx-auto">
              Sign in or create an account to start building at the speed of
              thought.
            </p>
          </div>

          <button
            onClick={handleGitHubLogin}
            disabled={isSigniningIn}
            className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-black font-semibold overflow-hidden transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-black" />

            {isSigniningIn ? (
              <div className="flex items-center gap-3">
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Connecting...</span>
              </div>
            ) : (
              <>
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </>
            )}
          </button>

          <div className="w-full mt-10 p-4 rounded-xl bg-black/30 border border-white/5 text-center">
            <p className="text-xs text-zinc-500 flex flex-col gap-1">
              <span>By continuing, you agree to our</span>
              <span className="flex items-center justify-center gap-2">
                <a
                  href="#"
                  className="hover:text-white transition-colors underline underline-offset-2 decoration-white/20"
                >
                  Terms of Service
                </a>
                <span>&bull;</span>
                <a
                  href="#"
                  className="hover:text-white transition-colors underline underline-offset-2 decoration-white/20"
                >
                  Privacy Policy
                </a>
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
