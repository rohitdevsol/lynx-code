"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectsQueryOptions } from "@/features/dashboard/queries";
import { useCreateEmptyProject } from "@/features/dashboard/mutations";
import { Folder, MoreVertical, Plus, Clock, Globe, Code2, Bot, Layout, Terminal, Wand2 } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { generateSlug } from "random-word-slugs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DashboardClient() {
  const router = useRouter();
  const { data: projectsData, isLoading } = useQuery(getProjectsQueryOptions());
  const createProject = useCreateEmptyProject();
  const [isGenerating, setIsGenerating] = useState(false);
  const projects = Array.isArray(projectsData) ? projectsData : [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleOpenDialog = () => {
    setProjectName(generateSlug(4, { format: "kebab" }));
    setProjectDescription("");
    setIsDialogOpen(true);
  };

  const handleCreateProject = async () => {
    if (!projectName) return;
    setIsGenerating(true);
    try {
      const result = await createProject.mutateAsync({
        name: projectName,
        description: projectDescription,
        template: "react"
      });
      setIsDialogOpen(false);
      
      const newProjectId = (result as any)?.project?.id || (result as any)?.id;
      if (newProjectId) {
        router.push(`/projects/${newProjectId}`);
      } else {
        console.error("Could not find project ID in result:", result);
        router.push(`/projects`);
      }
    } catch (error) {
      console.error("Failed to generate project:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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

          <button 
            onClick={handleOpenDialog}
            disabled={isGenerating}
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold overflow-hidden transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-black" />
            {isGenerating ? (
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isGenerating ? "Generating..." : "New Project"}</span>
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
          {projects.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-zinc-500">
              No projects yet. Click "New Project" to let AI generate one for you!
            </div>
          ) : projects.map((project: any) => (
             <div 
               key={project.id} 
               onClick={() => project.id && router.push(`/projects/${project.id}`)}
               className="group relative flex flex-col p-6 rounded-2xl glass-panel glass-panel-hover overflow-hidden cursor-pointer"
             >
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
               
               <div className="flex justify-between items-start mb-6 z-10">
                 <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-lynx-primary group-hover:bg-lynx-primary/10 group-hover:text-lynx-accent transition-colors duration-300">
                   <Folder className="w-6 h-6" />
                 </div>
                 
                 <button className="text-zinc-500 hover:text-white transition-colors p-1 z-20 rounded-md hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
                   <MoreVertical className="w-5 h-5" />
                 </button>
               </div>

               <div className="mt-auto z-10">
                 <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                   {project.name}
                 </h3>
                 {project.description && (
                   <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
                 )}
                 
                 <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors mt-4">
                   <div className="flex items-center gap-1.5">
                     <Clock className="w-3.5 h-3.5" />
                     <span>{project.updatedAt ? formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true }) : 'Unknown'}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                     <Globe className="w-3.5 h-3.5" />
                     <span className="flex items-center gap-1.5">
                       <span className={`w-2 h-2 rounded-full ${project.githubRepoUrl ? "bg-green-500" : "bg-yellow-500"}`} />
                       {project.githubRepoUrl ? "Synced" : "Draft"}
                     </span>
                   </div>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Project</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Provide a prompt and let AI structure the foundation of your new application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-zinc-300">Project Name</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-zinc-900 border-white/10 text-white"
                />
                <button 
                  onClick={() => setProjectName(generateSlug(4, { format: "kebab" }))}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md border border-white/10 transition-colors"
                  title="Generate Random Name"
                >
                  <Wand2 className="w-4 h-4 text-lynx-primary" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-zinc-300">Description (Optional)</Label>
              <Input
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="A brief description of your project..."
                className="bg-zinc-900 border-white/10 text-white"
              />
            </div>
            
            
          </div>
          
          <DialogFooter>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              disabled={isGenerating || !projectName }
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-semibold transition-all hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
