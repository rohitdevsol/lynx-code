"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

export function TerminalComponent({ 
  onInput,
  projectId,
  previewUrl 
}: { 
  onInput?: (data: string) => void,
  projectId?: string,
  previewUrl?: string 
}) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const onInputRef = useRef(onInput);

  useEffect(() => {
    onInputRef.current = onInput;
  }, [onInput]);

  useEffect(() => {
    if (!terminalRef.current) return;

    if (xtermRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#0D0D0D', 
        foreground: '#e4e4e7',
        cursor: '#8b5cf6', 
        selectionBackground: 'rgba(139, 92, 246, 0.3)',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 13,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln('\x1b[38;2;34;211;238m[LynxCode OS]\x1b[0m Starting E2B WebContainer Sandbox...');
    term.writeln('\x1b[2mProvisioning secure micro-VM...\x1b[0m');
    if (projectId) term.writeln(`\x1b[35mProject ID:\x1b[0m \x1b[2m${projectId}\x1b[0m`);
    if (previewUrl) {
      term.writeln('\x1b[32mDev Server Started: \x1b[0m \x1b[4m' + previewUrl + '\x1b[0m');
    }
    term.writeln('');

    let commandBuffer = "";

    term.onData((data) => {
      if (data === '\r') {
        term.writeln('');
        if (commandBuffer.trim() && onInputRef.current) {
          onInputRef.current(commandBuffer.trim());
        }
        commandBuffer = "";
        term.write('\x1b[36m$ \x1b[0m'); 
      }
      
      else if (data === '\x7F') {
        if (commandBuffer.length > 0) {
          commandBuffer = commandBuffer.slice(0, -1);
          term.write('\b \b');
        }
      }
      
      else if (data >= String.fromCharCode(0x20) && data <= String.fromCharCode(0x7E)) {
        commandBuffer += data;
        term.write(data);
      }
    });

    xtermRef.current = term;

    if (typeof window !== "undefined") {
      (window as any).__terminalWrite = (text: string) => {
        if (xtermRef.current) {
           const lines = text.split('\n');
           lines.forEach(line => xtermRef.current?.writeln(line));
           xtermRef.current.write('\x1b[36m$ \x1b[0m');
        }
      };
    }

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      xtermRef.current = null;
    };
  }, [projectId, previewUrl]); 

  return <div ref={terminalRef} className="w-full h-full overflow-hidden" />;
}
