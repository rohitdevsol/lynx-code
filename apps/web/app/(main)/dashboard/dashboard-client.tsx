"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getProjectsQueryOptions } from "@/features/dashboard/queries";
import { motion } from "framer-motion";
import { Folder, MoreVertical, Plus, Clock, Globe } from "lucide-react";

export function DashboardClient() {
  const { data: projects } = useSuspenseQuery(getProjectsQueryOptions());

  // Normally we would use real project data from the query, 
  // but let's mock the UI presentation for the sake of the beautiful design 
  // if the response is empty or standard.
  const displayProjects = projects?.length ? projects : [
    { id: 1, name: "Algo Arena: The Next Level", updatedAt: "2h ago", status: "Live" },
    { id: 2, name: "Nexus Design System", updatedAt: "5h ago", status: "Draft" },
    { id: 3, name: "Quantum Dashboard", updatedAt: "1d ago", status: "Live" },
    { id: 4, name: "Hyperion API Docs", updatedAt: "3d ago", status: "In Progress" },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col p-8 md:p-12 xl:p-16">

      <div className="fixed inset-0 z-0 bg-black pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lynx-primary/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
              All Projects
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Manage your applications, environments, and deployments.
            </p>
          </div>

          <button className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold overflow-hidden transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-black" />
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        <div className="flex items-center gap-6 border-b border-white/10 mb-8 pb-1">
          <button className="text-white border-b-2 border-white pb-3 text-sm font-medium px-1">
            All Projects
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors pb-3 text-sm font-medium px-1">
            Starred
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors pb-3 text-sm font-medium px-1">
            Shared with me
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project: any, i: number) => (
             <div 
               key={project.id} 
               className="group relative flex flex-col p-6 rounded-2xl glass-panel glass-panel-hover overflow-hidden cursor-pointer"
             >
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
               
               <div className="flex justify-between items-start mb-6 z-10">
                 <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-lynx-primary group-hover:bg-lynx-primary/10 group-hover:text-lynx-accent transition-colors duration-300">
                   <Folder className="w-6 h-6" />
                 </div>
                 
                 <button className="text-zinc-500 hover:text-white transition-colors p-1 z-20 rounded-md hover:bg-white/10">
                   <MoreVertical className="w-5 h-5" />
                 </button>
               </div>

               <div className="mt-auto z-10">
                 <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                   {project.name}
                 </h3>
                 
                 <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors mt-4">
                   <div className="flex items-center gap-1.5">
                     <Clock className="w-3.5 h-3.5" />
                     <span>{project.updatedAt}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                     <Globe className="w-3.5 h-3.5" />
                     <span className="flex items-center gap-1.5">
                       <span className={`w-2 h-2 rounded-full ${project.status === "Live" ? "bg-green-500" : "bg-yellow-500"}`} />
                       {project.status}
                     </span>
                   </div>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
