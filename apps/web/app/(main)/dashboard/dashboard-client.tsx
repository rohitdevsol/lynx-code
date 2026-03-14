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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
    if (!projectName.trim()) return;
    setIsGenerating(true);
    const normalizedName = projectName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    try {
      const result = await createProject.mutateAsync({
        name: normalizedName,
        description: projectDescription,
        template: "react"
      });
      setIsDialogOpen(false);
      
      const newProjectId = (result as any)?.project?.id || (result as any)?.id;
      if (newProjectId) {
        toast.success("Project created successfully!");
        setTimeout(() => {
          router.push(`/projects/${newProjectId}`);
        }, 500);
      } else {
        console.error("Could not find project ID in result:", result);
        router.push(`/projects`);
      }
    } catch (error) {
      console.error("Failed to generate project:", error);
      toast.error("Failed to generate project");
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 border-b-2 border-white pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading text-white tracking-widest uppercase mb-2">
              SYS_PROJECTS_DIR
            </h1>
            <p className="text-lynx-primary font-mono text-sm md:text-base uppercase bg-lynx-primary/10 inline-block px-2 py-0.5">
              // Local configurations and deployments active
            </p>
          </div>

          <button 
            onClick={handleOpenDialog}
            disabled={isGenerating}
            className="group relative flex items-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest brutal-shadow disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="flex items-center gap-6 border-b border-zinc-800 mb-8 pb-1 font-mono uppercase text-sm">
          <button className="text-lynx-primary border-b-2 border-lynx-primary pb-3 font-bold px-1">
            [ ALL_PROJECTS ]
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors pb-3 font-bold px-1">
            STARRED
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors pb-3 font-bold px-1">
            SHARED
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="flex flex-col p-6 border-2 border-zinc-800 bg-black h-[200px]">
                 <div className="flex justify-between items-start mb-6">
                   <Skeleton className="w-12 h-12 rounded-none bg-zinc-900" />
                   <Skeleton className="w-8 h-8 rounded-none bg-zinc-900" />
                 </div>
                 <div className="mt-auto">
                   <Skeleton className="h-8 w-3/4 mb-2 bg-zinc-900" />
                   <Skeleton className="h-4 w-full mb-4 bg-zinc-900" />
                   <div className="flex gap-4">
                     <Skeleton className="h-3 w-20 bg-zinc-900" />
                     <Skeleton className="h-3 w-20 bg-zinc-900" />
                   </div>
                 </div>
              </div>
            ))
          ) : projects.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-zinc-500">
              No projects yet. Click "New Project" to let AI generate one for you!
            </div>
          ) : projects.map((project: any) => (
             <div 
               key={project.id} 
               onClick={() => project.id && router.push(`/projects/${project.id}`)}
               className="group relative flex flex-col p-6 border-2 border-zinc-800 bg-black cursor-pointer hover:border-lynx-primary transition-colors"
             >
               <div className="flex justify-between items-start mb-6 z-10">
                 <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white group-hover:bg-lynx-primary group-hover:text-black transition-colors duration-300">
                   <Folder className="w-6 h-6" />
                 </div>
                 
                 <button className="text-zinc-500 hover:text-white transition-colors p-3 -m-2 z-20 rounded-none hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
                   <MoreVertical className="w-5 h-5" />
                 </button>
               </div>

               <div className="mt-auto z-10">
                 <h3 className="text-2xl font-heading text-white tracking-wide mb-2 group-hover:text-lynx-primary transition-colors">
                   {project.name}
                 </h3>
                 {project.description && (
                   <p className="text-xs font-mono text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
                 )}
                 
                 <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors mt-4 border-t border-zinc-800 pt-3">
                   <div className="flex items-center gap-1.5">
                     <Clock className="w-3.5 h-3.5" />
                     <span>{project.updatedAt ? formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true }) : 'Unknown'}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                     <span className={`w-2 h-2 rounded-none ${project.githubRepoUrl ? "bg-lynx-primary" : "bg-zinc-600"}`} />
                     {project.githubRepoUrl ? "SYNCED" : "DRAFT"}
                   </div>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-2 border-lynx-primary bg-black text-white rounded-none brutal-shadow">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading tracking-widest uppercase text-lynx-primary">INITIATE SEQUENCE</DialogTitle>
            <DialogDescription className="text-zinc-400 font-mono text-xs uppercase">
              // Setup parameters for new digital construction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4 font-mono">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-zinc-300 uppercase text-xs">Project Identifier</Label>
              <div className="flex gap-2 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-lynx-primary">
                  $
                </div>
                <Input
                  id="name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="pl-8 bg-zinc-900 border-zinc-700 text-white rounded-none focus-visible:ring-lynx-primary focus-visible:border-lynx-primary"
                />
                <button 
                  onClick={() => setProjectName(generateSlug(4, { format: "kebab" }))}
                  className="p-2 border border-zinc-700 hover:border-lynx-primary hover:text-lynx-primary transition-colors text-zinc-400 shrink-0"
                  title="Generate Hash"
                >
                  <Wand2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-zinc-300 uppercase text-xs">Directive (Optional)</Label>
              <Input
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="// Enter parameters..."
                className="bg-zinc-900 border-zinc-700 text-white rounded-none focus-visible:ring-lynx-primary focus-visible:border-lynx-primary"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-6 py-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              Abort
            </button>
            <button
              onClick={handleCreateProject}
              disabled={isGenerating || !projectName.trim() }
              className="px-6 py-2 bg-white text-black font-bold uppercase tracking-widest brutal-shadow hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  EXECUTING...
                </>
              ) : (
                "EXECUTE"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
