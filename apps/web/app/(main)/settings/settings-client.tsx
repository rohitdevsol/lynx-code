"use client";

import { motion } from "framer-motion";
import { Bell, Shield, Key, Moon, Monitor, Eye, CreditCard, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="relative min-h-screen w-full flex flex-col p-8 md:p-12 xl:p-16">
      <div className="fixed inset-0 z-0 bg-black pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lynx-primary/10 blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col flex-1">
        <h1 className="text-4xl md:text-5xl font-heading text-white tracking-widest uppercase mb-2">
          SYS_CONFIG
        </h1>
        <p className="text-lynx-primary font-mono text-sm mb-8 uppercase bg-lynx-primary/10 inline-block px-2 py-0.5 w-fit">
          // Global system preferences and active tokens
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex flex-col gap-2 font-mono uppercase text-sm font-bold tracking-widest">
            <button 
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-3 px-4 py-3 border-2 transition-all ${
                activeTab === "general" 
                  ? "bg-white text-black border-white brutal-shadow ml-2" 
                  : "text-zinc-500 border-transparent hover:border-zinc-800 hover:text-white"
              }`}
            >
              <Monitor className="w-4 h-4" />
              GENERAL
            </button>
            
            <button 
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 border-2 transition-all ${
                activeTab === "security" 
                  ? "bg-white text-black border-white brutal-shadow ml-2" 
                  : "text-zinc-500 border-transparent hover:border-zinc-800 hover:text-white"
              }`}
            >
              <Shield className="w-4 h-4" />
              SECURITY
            </button>

            <button 
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-3 px-4 py-3 border-2 transition-all ${
                activeTab === "billing" 
                  ? "bg-white text-black border-white brutal-shadow ml-2" 
                  : "text-zinc-500 border-transparent hover:border-zinc-800 hover:text-white"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              BILLING
            </button>

            <button 
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 border-2 transition-all ${
                activeTab === "notifications" 
                  ? "bg-white text-black border-white brutal-shadow ml-2" 
                  : "text-zinc-500 border-transparent hover:border-zinc-800 hover:text-white"
              }`}
            >
              <Bell className="w-4 h-4" />
              NOTIFICATIONS
            </button>
          </div>

          <div className="flex-1 right-panel">
            {activeTab === "general" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="border-2 border-zinc-800 bg-black p-6">
                  <h3 className="text-xl font-heading text-white mb-6 border-b-2 border-zinc-800 pb-4 tracking-widest uppercase">APPEARANCE</h3>
                  
                  <div className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-950 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-zinc-700 bg-black flex items-center justify-center text-white">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold font-mono text-sm text-white uppercase">Theme Preference</h4>
                        <p className="text-xs font-mono text-zinc-500 uppercase">// Default rendering mode</p>
                      </div>
                    </div>
                    
                    <select className="bg-black border-2 border-zinc-700 text-white font-mono text-xs uppercase px-3 py-2 cursor-pointer focus:border-lynx-primary focus:outline-none transition-colors">
                      <option value="system">System</option>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </div>
                </div>

                <div className="border-2 border-zinc-800 bg-black p-6">
                  <h3 className="text-xl font-heading text-white mb-6 border-b-2 border-zinc-800 pb-4 tracking-widest uppercase">ACCESSIBILITY</h3>
                  
                  <div className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-950">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-zinc-700 bg-black flex items-center justify-center text-white">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold font-mono text-sm text-white uppercase">Reduce Motion</h4>
                        <p className="text-xs font-mono text-zinc-500 uppercase">// DISABLE UI KINETICS</p>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-12 h-6 bg-zinc-800 border-2 border-zinc-700 peer-focus:outline-none peer-checked:bg-white peer-checked:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 peer-checked:after:bg-black after:border-none after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="border-2 border-zinc-800 bg-black p-6">
                  <h3 className="text-xl font-heading text-white mb-6 border-b-2 border-zinc-800 pb-4 tracking-widest uppercase">API_TOKENS</h3>
                  
                  <div className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-950 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-zinc-700 bg-black flex items-center justify-center text-white">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold font-mono text-sm text-white uppercase">Root Authority Key</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-lynx-primary font-mono tracking-widest">LYK_192837...ASDF98</p>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText("LYK_192837...ASDF98");
                              toast.success("Token copied to clipboard");
                            }}
                            className="text-zinc-500 hover:text-lynx-primary transition-colors p-1"
                            title="Copy Token"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button className="relative text-xs font-bold font-mono uppercase tracking-widest bg-red-600 hover:bg-white text-white hover:text-black border-2 border-red-600 hover:border-white px-4 py-2 transition-colors after:content-[''] after:absolute after:-m-3 after:inset-0 brutal-shadow-sm">
                      REVOKE
                    </button>
                  </div>

                  <button className="w-full py-4 border-2 border-dashed border-zinc-700 text-zinc-400 font-bold font-mono uppercase tracking-widest hover:border-white hover:text-white transition-colors text-sm">
                    + GENERATE NEW TOKEN
                  </button>
                </div>
              </motion.div>
            )}

            {(activeTab === "billing" || activeTab === "notifications") && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-12 border-2 border-zinc-800 bg-black text-center"
              >
                <p className="text-zinc-500 font-mono font-bold uppercase tracking-widest">// MODULE_OFFLINE</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
