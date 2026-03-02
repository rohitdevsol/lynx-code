"use client";

import { motion } from "framer-motion";
import { Bell, Shield, Key, Moon, Monitor, Eye, CreditCard } from "lucide-react";
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
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-zinc-400 text-sm md:text-base mb-8">
          Manage your account preferences and application settings.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "general" 
                  ? "bg-white/10 text-white font-medium border border-white/5 shadow-lg" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Monitor className="w-4 h-4" />
              General
            </button>
            
            <button 
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "security" 
                  ? "bg-white/10 text-white font-medium border border-white/5 shadow-lg" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>

            <button 
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "billing" 
                  ? "bg-white/10 text-white font-medium border border-white/5 shadow-lg" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Billing
            </button>

            <button 
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "notifications" 
                  ? "bg-white/10 text-white font-medium border border-white/5 shadow-lg" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
          </div>

          <div className="flex-1 right-panel">
            {activeTab === "general" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">Appearance</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-lynx-primary">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Theme Preference</h4>
                        <p className="text-xs text-zinc-400">Choose how Lynx looks to you.</p>
                      </div>
                    </div>
                    
                    <select className="bg-black border border-white/20 text-white text-sm rounded-lg outline-none px-3 py-2 cursor-pointer focus:border-lynx-primary">
                      <option value="system">System Default</option>
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                    </select>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">Accessibility</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-lynx-accent">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Reduce Motion</h4>
                        <p className="text-xs text-zinc-400">Minimize animations across the dashboard.</p>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lynx-primary"></div>
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
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">API Keys</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-white">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Default Project Key</h4>
                        <p className="text-xs text-zinc-500 font-mono mt-1">lyk_192837...asdf98</p>
                      </div>
                    </div>
                    
                    <button className="text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors">
                      Revoke
                    </button>
                  </div>

                  <button className="w-full py-3 rounded-xl border border-dashed border-white/20 text-zinc-400 font-medium hover:border-white/40 hover:text-white transition-colors text-sm">
                    + Generate New Key
                  </button>
                </div>
              </motion.div>
            )}

            {(activeTab === "billing" || activeTab === "notifications") && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl text-center"
              >
                <p className="text-zinc-500 font-medium">Coming soon.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
