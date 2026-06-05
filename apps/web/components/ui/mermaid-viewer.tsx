"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  fontFamily: "Inter, sans-serif",
});

interface MermaidViewerProps {
  chart: string;
}

export function MermaidViewer({ chart }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!chart || !containerRef.current) return;

      try {
        setError(null);
        const cleanChart = chart
          .replace(/```mermaid/g, "")
          .replace(/```/g, "")
          .trim();

        const id = `mermaid-svg-${Math.round(Math.random() * 1000000)}`;
        const { svg } = await mermaid.render(id, cleanChart);

        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to render flowchart");
          console.error("Mermaid error:", err);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className="w-full rounded-[32px] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden flex flex-col relative group">
      {/* Tools */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-1.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl">
        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-700/50 mx-1" />
        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-auto min-h-[500px] flex items-center justify-center bg-slate-950/30 p-12"
      >
        {error ? (
          <div className="text-red-400 flex flex-col items-center text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-lg">
            <span className="font-bold mb-3 text-red-300">
              Gagal merender grafik Mermaid
            </span>
            <span className="text-xs font-mono opacity-80 break-all bg-red-950/50 p-4 rounded-xl">
              {error}
            </span>
          </div>
        ) : svgContent ? (
          <div
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto transition-transform duration-300"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="animate-pulse flex items-center gap-3 text-slate-500 font-medium">
            <div className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            Menggambar Peta Konsep...
          </div>
        )}
      </div>
    </div>
  );
}
