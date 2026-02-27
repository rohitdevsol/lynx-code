"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getHomeDataQueryOptions } from "@/features/home/queries";
import { motion } from "framer-motion";
import { Search, Mic, ArrowUp } from "lucide-react";

export function HomeClient() {
  const { data } = useSuspenseQuery(getHomeDataQueryOptions());

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black selection:bg-lynx-primary/30 selection:text-white">
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-noise z-10 opacity-[0.02]" />
        
        <div
          className="absolute top-1/4 left-1/4 w-[60%] h-[60%] rounded-full bg-lynx-primary/30 blur-[180px] mix-blend-screen"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] rounded-full bg-lynx-accent/20 blur-[150px] mix-blend-screen"
        />
        
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
      </div>

      <div className="relative z-20 w-full max-w-3xl flex flex-col items-center flex-1 justify-center -mt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight text-center">
          Ready to build, Rohit?
        </h1>

        <div className="w-full relative group">
          <div className="absolute -inset-[2px] bg-gradient-to-r from-lynx-primary/50 to-lynx-accent/50 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          
          <div className="relative flex items-center w-full bg-[#1a1a1f] border border-white/10 rounded-2xl p-2 shadow-2xl transition-all duration-300 group-hover:bg-[#222228] group-hover:border-white/20">
            <div className="flex-1 flex items-center pl-4 pr-2 py-3">
              <input 
                type="text" 
                placeholder="Ask Lovable to create a web app that..." 
                className="w-full bg-transparent text-white placeholder-zinc-500 outline-none text-lg"
              />
            </div>
            
            <div className="flex items-center gap-2 pr-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <span className="hidden sm:inline">Plan</span>
              </button>
              
              <button className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <Mic className="w-5 h-5" />
              </button>
              
              <button className="p-2 bg-white text-black hover:bg-zinc-200 transition-colors rounded-xl">
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="fixed bottom-0 left-0 w-full px-4 sm:px-8 pb-8 z-30 flex justify-center">
        <div className="w-full max-w-5xl bg-[#131316] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            <button className="text-zinc-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Recently viewed
            </button>
            <button className="text-white bg-white/5 border border-white/10 text-sm font-medium px-4 py-2 rounded-lg backdrop-blur-md shadow-sm whitespace-nowrap">
              My projects
            </button>
            <button className="text-zinc-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Templates
            </button>
          </div>
          
          <button className="text-zinc-400 hover:text-white text-sm font-medium flex items-center gap-2 group ml-4 whitespace-nowrap">
            Browse all 
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
        </div>
      </div> */}
    </div>
  );
}
