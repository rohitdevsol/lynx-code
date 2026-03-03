"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Play, RefreshCw, X, FolderTree, FileJson,
  ChevronRight, Send, Bot, User, Menu, Globe,
  Sparkles, Loader2, Copy
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Editor } from "@monaco-editor/react";
import dynamic from "next/dynamic";
const TerminalComponent = dynamic(() => import("@/components/ide/Terminal").then(mod => mod.TerminalComponent), { ssr: false });
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectFilesQueryOptions, getChatHistoryQueryOptions } from "@/features/workspace/queries";
import { useMountSandbox, useSyncFile, useExecCommand } from "@/features/workspace/mutations";
import { buildFileTree, type FileNode } from "@/features/workspace/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";

function useDragResize(
  direction: "horizontal" | "vertical",
  initial: number,
  min: number,
  max: number,
  reverse: boolean = false
) {
  const [size, setSize] = useState(initial);
  const dragging = useRef(false);
  const startPos = useRef(0);
  const startSize = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
      startSize.current = size;

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        let delta =
          direction === "horizontal"
            ? ev.clientX - startPos.current
            : ev.clientY - startPos.current;
        if (reverse) delta = -delta;
        setSize(Math.min(max, Math.max(min, startSize.current + delta)));
      };
      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [direction, size, min, max]
  );

  return [size, onMouseDown] as const;
}


function VDivider({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1 shrink-0 cursor-col-resize bg-white/5 hover:bg-lynx-accent/50 active:bg-lynx-accent transition-colors relative group"
    >
      <div className="absolute inset-y-0 -left-1 -right-1" /> 
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/20 group-hover:bg-lynx-accent/80 transition-colors" />
    </div>
  );
}

function HDivider({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="h-1 shrink-0 cursor-row-resize bg-white/5 hover:bg-lynx-accent/50 active:bg-lynx-accent transition-colors relative group"
    >
      <div className="absolute inset-x-0 -top-1 -bottom-1" /> 
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-8 rounded-full bg-white/20 group-hover:bg-lynx-accent/80 transition-colors" />
    </div>
  );
}

export function ProjectWorkspaceClient({ projectId }: { projectId: string }) {
  const { data: serverFiles } = useSuspenseQuery(getProjectFilesQueryOptions(projectId));
  const files = useMemo(() => buildFileTree(serverFiles || []), [serverFiles]);

  const { data: serverHistory } = useSuspenseQuery(getChatHistoryQueryOptions(projectId));
  
  const initialChat = useMemo(() => {
    if (!serverHistory || serverHistory.length === 0) {
      return [{ role: "assistant", content: "Hello! I'm ready to help you build this project. What would you like to create or modify?" }];
    }
    return serverHistory.map((m: any) => ({
      role: m.role.toLowerCase(),
      content: m.content
    }));
  }, [serverHistory]);

  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>(initialChat);
  
  const queryClient = useQueryClient();
  const [chatInput, setChatInput] = useState("");
  const [activeBottomTab, setActiveBottomTab] = useState<"TERMINAL" | "OUTPUT" | "PROBLEMS">("TERMINAL");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isMountingSandbox, setIsMountingSandbox] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasAutoStreamed = useRef(false);

  const [chatWidth, onChatDrag] = useDragResize("horizontal", 420, 280, 700);
  const [termHeight, onTermDrag] = useDragResize("vertical", 220, 120, 500, true);

  const mountSandbox = useMountSandbox();
  const syncFile = useSyncFile();
  const execCommand = useExecCommand();

  const handleTerminalSubmit = useCallback(async (command: string) => {
    if (!command.trim() || !projectId) return;
    try {
      const res = await execCommand.mutateAsync({ projectId, command });
      if (typeof window !== "undefined" && (window as any).__terminalWrite) {
        let output = "";
        // @ts-ignore
        if (res.stdout) output += res.stdout + "\n";
        // @ts-ignore
        if (res.stderr) output += `\x1b[31m${res.stderr}\x1b[0m\n`;
        (window as any).__terminalWrite(output || "Executed successfully.\n");
      }
    } catch (err) {
      if (typeof window !== "undefined" && (window as any).__terminalWrite) {
        (window as any).__terminalWrite(`\x1b[31mError: ${err}\x1b[0m\n`);
      }
    }
  }, [projectId, execCommand]);

  useEffect(() => {
    if (!selectedFile && files.length > 0) {
      const getFirstFile = (nodes: FileNode[]): FileNode | null => {
        for (const node of nodes) {
          if (node.type === "file") return node;
          if (node.children) {
            const childFile = getFirstFile(node.children);
            if (childFile) return childFile;
          }
        }
        return null;
      };
      const first = getFirstFile(files);
      if (first) setSelectedFile(first);
    }
  }, [files, selectedFile]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const hasLaunchedSandbox = useRef(false);

  const triggerSandboxMount = useCallback(async () => {
    if (hasLaunchedSandbox.current) return;
    hasLaunchedSandbox.current = true;
    setIsMountingSandbox(true);
    try {
      const data = await mountSandbox.mutateAsync(projectId);
      // @ts-ignore
      if (data && data.url) setPreviewUrl(data.url);
    } catch (err) {
      console.error("Failed to mount sandbox:", err);
      hasLaunchedSandbox.current = false;
    } finally {
      setIsMountingSandbox(false);
    }
  }, [projectId, mountSandbox]);

  // Lazy load if we already have files and a chat history
  useEffect(() => {
    if (chatMessages.length > 1 || files.length > 0) {
      triggerSandboxMount();
    } else {
      setIsMountingSandbox(false);
    }
  }, [chatMessages.length, files.length, triggerSandboxMount]);

  const streamAiResponse = async (prompt: string) => {
    setIsStreaming(true);
    setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL || "http://localhost:4000";
      const response = await fetch(`${apiUrl}/ai/stream-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          prompt,
          projectId,
          chatSessionId: undefined
        })
      });

      if (!response.ok || !response.body) throw new Error("Stream error");

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          setChatMessages((prev) => {
            const msgs = [...prev];
            if (msgs.length > 0) {
              msgs[msgs.length - 1]!.content += value;
            }
            return msgs;
          });
        }
      }
      
      // Refetch files to show newly generated ones
      queryClient.invalidateQueries({ queryKey: ["project-files", projectId] });
      
    } catch {
      setChatMessages((prev) => {
        const msgs = [...prev];
        if (msgs.length > 0) msgs[msgs.length - 1]!.content += "\n\n[Connection Error]";
        return msgs;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isStreaming) return;
    const userMessage = chatInput;
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");
    if (textareaRef.current) textareaRef.current.style.height = "36px";
  
    triggerSandboxMount();
    
    await streamAiResponse(userMessage);
  };

  // Auto-trigger stream if the last item in history is a USER message
  useEffect(() => {
    if (hasAutoStreamed.current || isStreaming) return;
    const lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg && lastMsg.role === "user") {
      hasAutoStreamed.current = true;
      streamAiResponse(lastMsg.content);
    }
  }, [chatMessages, isStreaming]);

  const debounceTimeoutFileRef = useRef<NodeJS.Timeout | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (!value || !selectedFile) return;
    setSelectedFile({ ...selectedFile, content: value });
    
    if (debounceTimeoutFileRef.current) {
      clearTimeout(debounceTimeoutFileRef.current);
    }
    
    debounceTimeoutFileRef.current = setTimeout(() => {
      syncFile.mutate({ projectId, filePath: selectedFile.path, content: value });
    }, 400);
  };

  const FolderNode = ({ item, level }: { item: FileNode; level: number }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full py-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          <ChevronRight className={`w-3.5 h-3.5 mr-1.5 opacity-50 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          <FolderTree className="w-3.5 h-3.5 mr-2 text-lynx-primary opacity-80" />
          <span className="truncate text-xs font-mono">{item.name}</span>
        </button>
        {isOpen && item.children && <FileTree items={item.children} level={level + 1} />}
      </div>
    );
  };

  const FileTree = ({ items, level = 0 }: { items?: FileNode[]; level?: number }) => (
    <div className="flex flex-col w-full">
      {items?.map((item, idx) =>
        item && (
          <React.Fragment key={idx}>
            {item.type === "folder" ? (
              <FolderNode item={item} level={level} />
            ) : (
              <div className="w-full">
                <button
                  onClick={() => setSelectedFile(item)}
                  className={`flex items-center w-full py-1.5 hover:bg-white/5 transition-colors ${
                    selectedFile?.path === item.path
                      ? "bg-lynx-primary/20 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  style={{ paddingLeft: `${level * 12 + 8}px` }}
                >
                  <FileJson className="w-3.5 h-3.5 mr-2 ml-5 text-lynx-accent opacity-70" />
                  <span className="truncate text-xs font-mono">{item.name}</span>
                </button>
              </div>
            )}
          </React.Fragment>
        )
      )}
    </div>
  );

  return (
    <div className="flex w-full h-screen bg-[#0a0a0b] overflow-hidden select-none">

      <div
        className="flex flex-col bg-zinc-950 border-r border-white/[0.06] shrink-0 overflow-hidden"
        style={{ width: chatWidth }}
      >
        <div className="flex items-center gap-3 px-5 h-14 border-b border-white/[0.06] shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center">
            <Image src="/logo.svg" alt="Lynx AI" width={24} height={24} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-none">Lynx AI</div>
            <div className="text-[11px] mt-0.5">
              {isStreaming ? (
                <span className="text-lynx-accent animate-pulse">Thinking…</span>
              ) : (
                <span className="text-emerald-500">Ready</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 min-h-0">
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === "user"
                    ? "bg-zinc-800 text-zinc-300"
                    : "bg-gradient-to-br from-lynx-primary/40 to-lynx-accent/20 text-lynx-accent"
                }`}
              >
                {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed overflow-x-auto ${
                    msg.role === "user"
                      ? "bg-zinc-800 text-zinc-100 rounded-tr-sm"
                      : "bg-[#18181a] border border-white/[0.06] text-zinc-300 rounded-tl-sm w-full"
                  }`}
                >
                  {msg.content ? (
                    <div className="prose prose-invert max-w-none text-sm prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            // Match filepaths like language-src/App.tsx or language-tsx
                            const match = /language-([\w\.:\/-]+)/.exec(className || "");
                            const lang = (match ? match[1] : "") || "";
                            const codeString = String(children).replace(/\n$/, "");
                            
                            const fileExt = lang.includes(".") ? lang.split(".").pop() || lang : lang;
                            const displayLang = fileExt === "ts" || fileExt === "tsx" ? "typescript" 
                                              : fileExt === "js" || fileExt === "jsx" ? "javascript"
                                              : fileExt || "text";
  
                            if (!inline) {
                              return (
                                <div className="my-3 overflow-hidden rounded-md border border-white/10 bg-[#0d0d0d]">
                                  <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-400">
                                     <span>{lang || "code"}</span>
                                  </div>
                                  <SyntaxHighlighter
                                    {...props}
                                    style={vscDarkPlus as any}
                                    language={displayLang}
                                    PreTag="div"
                                    customStyle={{ margin: 0, padding: "12px", background: "transparent" }}
                                  >
                                    {codeString}
                                  </SyntaxHighlighter>
                                </div>
                              );
                            }
                            return (
                              <code {...props} className="bg-white/10 px-1.5 py-0.5 rounded-md font-mono text-[13px] text-lynx-accent">
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {msg.content
                          .replace(/<boltArtifact[^>]*>/g, '')
                          .replace(/<\/boltArtifact>/g, '')
                          .replace(/<boltAction\s+type="file"\s+filePath="([^"]+)">/g, '```$1\n')
                          .replace(/<\/boltAction>/g, '\n```')}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs">Generating…</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        <div className="p-4 border-t border-white/[0.06] shrink-0">
          <div className="flex items-end gap-2 bg-zinc-900 rounded-2xl border border-white/[0.08] focus-within:border-lynx-primary/40 transition-colors p-2 pl-4">
            <textarea
              ref={textareaRef}
              rows={1}
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask Lynx to build or modify… (Enter to send)"
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none resize-none leading-relaxed py-1.5 max-h-[120px] select-text"
              style={{ height: "36px" }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isStreaming || !chatInput.trim()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-lynx-primary/20 text-lynx-accent hover:bg-lynx-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 text-center">Shift+Enter for new line</p>
        </div>
      </div>

      <VDivider onMouseDown={onChatDrag} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Top Toolbar ── */}
        <div className="flex items-center justify-between h-14 shrink-0 border-b border-white/[0.06] px-3 bg-zinc-950/90 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFileExplorer(!showFileExplorer)}
              className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <div className="flex items-center bg-zinc-900/80 p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3.5 py-1.5 flex items-center gap-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "code" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Code
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3.5 py-1.5 flex items-center gap-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "preview" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Play className="w-3.5 h-3.5" /> Preview
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedFile && activeTab === "code" && (
              <span className="text-xs text-zinc-500 font-mono bg-zinc-900 px-2.5 py-1 rounded-lg border border-white/5 truncate max-w-[200px]">
                {selectedFile.path}
              </span>
            )}
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className="bg-zinc-900 text-zinc-400 border border-white/[0.06] text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="vs-dark">VS Dark</option>
              <option value="hc-black">High Contrast</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">

          <AnimatePresence>
            {showFileExplorer && activeTab === "code" && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 210, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="h-full border-r border-white/[0.06] bg-[#0f0f10] shrink-0 overflow-y-auto flex flex-col"
              >
                <div className="px-4 py-2.5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest sticky top-0 bg-[#0f0f10]/95 backdrop-blur z-10 border-b border-white/[0.04]">
                  Explorer
                </div>
                <FileTree items={files} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#1e1e1e]">
            {activeTab === "code" ? (
              selectedFile ? (
                <>
                  <div className="h-9 border-b border-white/[0.06] bg-zinc-900/80 flex items-center shrink-0">
                    <div className="px-4 h-full flex items-center gap-2 border-r border-white/[0.06] border-b-2 border-b-lynx-primary bg-[#1e1e1e] text-xs text-white font-mono">
                      <FileJson className="w-3 h-3 text-lynx-accent" />
                      {selectedFile.name}
                      <button className="ml-1 opacity-40 hover:opacity-100">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <Editor
                      height="100%"
                      language={
                        selectedFile.name.endsWith("tsx") || selectedFile.name.endsWith("ts")
                          ? "typescript"
                          : selectedFile.name.endsWith("jsx") || selectedFile.name.endsWith("js")
                          ? "javascript"
                          : selectedFile.name.endsWith("json")
                          ? "json"
                          : selectedFile.name.endsWith("css")
                          ? "css"
                          : selectedFile.name.endsWith("html")
                          ? "html"
                          : "plaintext"
                      }
                      theme={editorTheme}
                      value={selectedFile.content}
                      path={selectedFile.path}
                      onChange={handleEditorChange}
                      beforeMount={(monaco) => {
                        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                          jsx: monaco.languages.typescript.JsxEmit.ReactJSX || 4,
                          allowNonTsExtensions: true,
                          moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs || 2,
                        });
                        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                          jsx: monaco.languages.typescript.JsxEmit.ReactJSX || 4,
                          allowNonTsExtensions: true,
                        });
                        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                          noSemanticValidation: true,
                          noSyntaxValidation: false,
                        });
                        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                          noSemanticValidation: true,
                          noSyntaxValidation: false,
                        });
                      }}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontLigatures: true,
                        padding: { top: 16, bottom: 16 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        formatOnPaste: true,
                        lineHeight: 22,
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-600 flex-col gap-3">
                  <FileJson className="w-8 h-8 opacity-30" />
                  <span className="text-sm">Select a file to edit</span>
                </div>
              )
            ) : (
             
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="h-10 bg-zinc-100 flex items-center px-3 border-b border-zinc-200 gap-3 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white border border-zinc-200 rounded-md px-3 py-1 flex items-center gap-2 text-xs text-zinc-500">
                    <Globe className="w-3 h-3 shrink-0" />
                    <span className="truncate flex-1 select-text">{previewUrl || "Waiting for server..."}</span>
                    {previewUrl && (
                      <button 
                        onClick={() => navigator.clipboard.writeText(previewUrl)}
                        className="hover:text-black transition-colors shrink-0 flex items-center justify-center"
                        title="Copy URL"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                    <RefreshCw className="w-3 h-3 shrink-0 hover:text-black cursor-pointer" />
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center bg-zinc-50">
                  {isMountingSandbox ? (
                    <div className="flex flex-col items-center gap-3 text-zinc-400">
                      <RefreshCw className="w-5 h-5 animate-spin text-lynx-primary" />
                      <span className="text-sm">Initiating E2B Secure Sandbox…</span>
                    </div>
                  ) : previewUrl ? (
                    <iframe src={previewUrl} className="w-full h-full border-none" />
                  ) : (
                    <span className="text-sm text-zinc-400">Sandbox preview unavailable.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <HDivider onMouseDown={onTermDrag} />

        <div
          className="flex flex-col bg-[#0d0d0e] shrink-0 overflow-hidden"
          style={{ height: termHeight }}
        >
          <div className="h-9 bg-zinc-900/80 border-b border-white/[0.06] flex items-center px-4 gap-1 shrink-0">
            {(["TERMINAL", "OUTPUT", "PROBLEMS"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveBottomTab(tab)}
                className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  activeBottomTab === tab ? "text-white bg-white/[0.08]" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden p-2 min-h-0 select-text relative">
            <div className={activeBottomTab === "TERMINAL" ? "block h-full w-full" : "hidden"}>
              <TerminalComponent previewUrl={previewUrl} projectId={projectId} onInput={handleTerminalSubmit} />
            </div>
            {activeBottomTab === "OUTPUT" && (
              <div className="h-full w-full font-mono text-xs text-zinc-400 p-2 overflow-auto whitespace-pre-wrap">
                [Output] Sandbox build logs will appear here...
              </div>
            )}
            {activeBottomTab === "PROBLEMS" && (
              <div className="h-full w-full font-mono text-xs text-zinc-400 p-2 overflow-auto">
                No problems detected in the workspace.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}