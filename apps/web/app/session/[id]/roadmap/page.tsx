"use client";
import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import {
  ChevronLeft,
  Map,
  Download,
  Share2,
  BookOpen,
  Video,
  ExternalLink,
  CheckCircle2,
  Circle,
  RefreshCw,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MermaidViewer } from "@/components/ui/mermaid-viewer";
import type { RoadmapData } from "@/types/roadmap";

const MOCK_ROADMAP: RoadmapData = {
  title: "Physics: Einstein's Core Theories",
  estimatedTotalTime: "8-12 hours",
  topics_extracted: ["Relativity", "Time Dilation", "Gravity", "Spacetime"],
  legend: [
    { type: "core", emoji: "📗", label: "Dari Materi", color: "#52B788" },
    {
      type: "prerequisite",
      emoji: "📘",
      label: "Wajib Dipahami",
      color: "#5B9BD5",
    },
    {
      type: "practice",
      emoji: "📕",
      label: "Latihan/Aplikasi",
      color: "#E05C5C",
    },
    { type: "reflection", emoji: "🔄", label: "Refleksi", color: "#F4A261" },
    { type: "advanced", emoji: "🔗", label: "Lanjutan", color: "#A89BD9" },
  ],
  sections: [
    {
      number: 1,
      title: "Fondasi Konseptual",
      emoji: "1️⃣",
      description: "Prasyarat dan konsep dasar sebelum masuk ke relativitas",
      nodes: [
        {
          id: "n1",
          label: "Newtonian Physics Overview",
          type: "prerequisite",
          source: "ai_recommended",
          description:
            "Memahami gaya, gravitasi Newton, dan kerangka acuan inersia.",
          difficulty: "beginner",
          estimatedTime: "2 jam",
          order: 1,
          resources: [
            {
              title: "Khan Academy: Physics",
              url: "#",
              type: "course",
              isPaid: false,
            },
          ],
        },
        {
          id: "n2",
          label: "Sistem Koordinat 3D & Waktu",
          type: "prerequisite",
          source: "ai_recommended",
          description:
            "Membiasakan diri dengan dimensi ruang dan waktu sebagai variabel terpisah.",
          difficulty: "beginner",
          estimatedTime: "1 jam",
          order: 2,
        },
      ],
    },
    {
      number: 2,
      title: "Inti Materi: Relativitas Khusus",
      emoji: "2️⃣",
      description: "Teori kecepatan cahaya konstan dan implikasinya",
      nodes: [
        {
          id: "n3",
          label: "Postulat Einstein",
          type: "core",
          source: "from_audio",
          description:
            "Cahaya sama cepatnya dari semua kerangka acuan pengamat.",
          difficulty: "intermediate",
          estimatedTime: "1 jam",
          order: 1,
        },
        {
          id: "n4",
          label: "Time Dilation (Dilasi Waktu)",
          type: "core",
          source: "from_audio",
          description:
            "Waktu berjalan lebih lambat saat bergerak mendekati kecepatan cahaya.",
          difficulty: "intermediate",
          estimatedTime: "1.5 jam",
          order: 2,
          resources: [
            {
              title: "MinutePhysics: Time Dilation",
              url: "#",
              type: "video",
              isPaid: false,
            },
          ],
        },
      ],
    },
    {
      number: 3,
      title: "Aplikasi & Praktik",
      emoji: "3️⃣",
      description: "Penerapan relativitas dalam fenomena nyata",
      nodes: [
        {
          id: "n5",
          label: "E=mc² dalam Reaksi Nuklir",
          type: "practice",
          source: "ai_recommended",
          description: "Menghitung energi dari konversi massa reaktor nuklir.",
          difficulty: "advanced",
          estimatedTime: "2 jam",
          order: 1,
        },
        {
          id: "n6",
          label: "GPS & Relativitas",
          type: "practice",
          source: "from_audio",
          description:
            "Bagaimana satelit GPS mengoreksi waktu karena gravitasi Bumi.",
          difficulty: "intermediate",
          estimatedTime: "1 jam",
          order: 2,
        },
      ],
    },
    {
      number: 4,
      title: "Refleksi Siklus (Continuous Flow)",
      emoji: "🔄",
      description:
        "Review materi dan menghubungkannya kembali ke paradigma baru fisika",
      nodes: [
        {
          id: "n7",
          label: "Paradigma Bergeser",
          type: "reflection",
          source: "ai_recommended",
          description:
            "Bagaimana relativitas membatalkan pandangan Newton? Renungkan perbedaannya.",
          difficulty: "beginner",
          estimatedTime: "30 menit",
          order: 1,
        },
        {
          id: "n8",
          label: "Menuju Relativitas Umum",
          type: "advanced",
          source: "ai_recommended",
          description: "Persiapan siklus belajar berikutnya: Spacetime curve.",
          difficulty: "advanced",
          estimatedTime: "1 jam",
          order: 2,
        },
      ],
    },
  ],
};

const SECTION_COLORS = [
  "border-blue-400 text-blue-500 bg-blue-500/10",
  "border-emerald-400 text-emerald-500 bg-emerald-500/10",
  "border-amber-400 text-amber-500 bg-amber-500/10",
  "border-rose-400 text-rose-500 bg-rose-500/10",
  "border-purple-400 text-purple-500 bg-purple-500/10",
];

const SECTION_BORDER_ONLY = [
  "border-blue-200",
  "border-emerald-200",
  "border-amber-200",
  "border-rose-200",
  "border-purple-200",
];

export default function RoadmapPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"milestones" | "concept_map">(
    "milestones",
  );
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const sessionRes = await fetch(`/api/session/${id}`);
        if (!sessionRes.ok) {
          setData(null);
          setLoading(false);
          return;
        }

        const sessionData = await sessionRes.json();

        if (sessionData.roadmap) {
          setData(JSON.parse(sessionData.roadmap));
          setLoading(false);
          return;
        }

        if (!sessionData.transcript) {
          setData(null);
          setLoading(false);
          return;
        }

        const response = await fetch("/api/roadmap/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: id,
            transcript: sessionData.transcript,
            language: sessionData.language || "id",
            content_type: "academic",
          }),
        });

        if (!response.ok) throw new Error("API Route failed");
        const jsonResponse = await response.json();
        setData(jsonResponse);
      } catch (error) {
        console.error("Roadmap fetch error:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [id]);

  const toggleNode = (nodeId: string) => {
    setCompletedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) newSet.delete(nodeId);
      else newSet.add(nodeId);
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen text-slate-800 flex items-center justify-center flex-col gap-6">
        <Map className="w-16 h-16 text-slate-300 animate-pulse" />
        <h2 className="text-xl font-bold animate-pulse text-slate-400">
          Generating Learning Roadmap...
        </h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen text-slate-800 flex items-center justify-center flex-col gap-6">
        <Map className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-400">
          Roadmap belum bisa dibuat
        </h2>
        <p className="text-slate-500 text-sm text-center max-w-sm">
          Transkrip audio belum tersedia atau sesi tidak ditemukan. Pastikan audio sudah berhasil ditranskripsi terlebih dahulu.
        </p>
        <Link
          href={`/session/${id}`}
          className="px-6 py-3 bg-teal-500 text-white font-bold rounded-xl text-sm hover:bg-teal-600 transition-colors"
        >
          Kembali ke Sesi
        </Link>
      </div>
    );
  }

  const totalNodes = data.sections.reduce(
    (acc: number, sec: any) => acc + sec.nodes.length,
    0,
  );
  const progressPercent =
    totalNodes > 0 ? Math.round((completedNodes.size / totalNodes) * 100) : 0;

  return (
    <div className="min-h-screen text-slate-800 pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto pt-32 px-6">
        {/* Header Options & Tabs */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end mb-12">
          <div className="flex p-1.5 bg-slate-900/50 rounded-2xl border border-[var(--border-default)] w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab("milestones")}
              className={cn(
                "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === "milestones"
                  ? "bg-[var(--bg-card)] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              Milestones
            </button>
            <button
              onClick={() => setActiveTab("concept_map")}
              className={cn(
                "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === "concept_map"
                  ? "bg-[var(--bg-card)] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              Concept Map
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/session/${id}`}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold">Back to Session</span>
            </Link>

            <div className="w-px h-6 bg-slate-200 mx-2 hidden md:block" />

            <button className="p-2.5 bg-slate-100/50 rounded-xl hover:bg-slate-200 transition-colors hidden md:flex">
              <Share2 className="w-4 h-4 text-slate-600" />
            </button>
            <button className="p-2.5 bg-slate-100/50 rounded-xl hover:bg-slate-200 transition-colors hidden md:flex">
              <Download className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Roadmap Title & Progress */}
        <div className="bg-slate-900 p-8 md:p-12 rounded-[32px] mb-12 shadow-xl shadow-slate-900/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-500">
                <Map className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  {data.title}
                </h1>
                <p className="text-slate-400 mt-1 text-sm font-medium flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Learning Roadmap • {data.estimatedTotalTime}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-bold text-slate-400">
                Your Progress
              </span>
              <span className="text-sm font-bold text-teal-400">
                {completedNodes.size} / {totalNodes} Done ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-12">
          {data.legend.map((lg: any) => (
            <div
              key={lg.type}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900/40 border border-slate-800 px-3 py-2 rounded-xl"
            >
              <span className="text-sm">{lg.emoji}</span>
              {lg.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "milestones" ? (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-12 lg:gap-16">
                {data.sections.map((section: any, index: number) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div
                      key={section.number}
                      className={cn(
                        "flex flex-col lg:flex-row gap-8 items-start relative",
                        !isEven && "lg:flex-row-reverse",
                      )}
                    >
                      {/* Section Marker */}
                      <div className="w-full lg:w-[280px] shrink-0 z-10 sticky top-32">
                        <div className="p-6 rounded-[32px] bg-slate-900/50 border border-[var(--border-default)] backdrop-blur-xl">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center justify-center text-2xl">
                              {section.emoji}
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-bold text-teal-400 mb-1 uppercase tracking-wider">
                                Section {section.number}
                              </div>
                              <h3 className="text-lg font-bold text-slate-100 leading-tight">
                                {section.title}
                              </h3>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {section.description}
                          </p>
                        </div>
                      </div>

                      {/* Nodes Container */}
                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
                        {section.nodes.map((node: any) => {
                          const isDone = completedNodes.has(node.id);
                          return (
                            <motion.div
                              key={node.id}
                              className={cn(
                                "bg-[var(--bg-card)] rounded-[24px] p-6 border transition-all cursor-pointer group",
                                isDone
                                  ? "border-teal-500/50 bg-teal-500/5"
                                  : "border-[var(--border-default)] hover:border-slate-500",
                              )}
                              onClick={() => toggleNode(node.id)}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <span
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold",
                                    isDone
                                      ? "bg-teal-500/20 text-teal-400"
                                      : "bg-slate-800 text-slate-300",
                                  )}
                                >
                                  {data.legend.find(
                                    (l: any) => l.type === node.type,
                                  )?.label || node.type}
                                </span>

                                <button
                                  className={cn(
                                    "transition-colors",
                                    isDone
                                      ? "text-teal-400"
                                      : "text-slate-300 hover:text-slate-500",
                                  )}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                  ) : (
                                    <Circle className="w-6 h-6" />
                                  )}
                                </button>
                              </div>

                              <h4
                                className={cn(
                                  "text-lg font-bold mb-2 transition-colors",
                                  isDone
                                    ? "text-slate-400 line-through"
                                    : "text-slate-100",
                                )}
                              >
                                {node.label}
                              </h4>

                              <p
                                className={cn(
                                  "text-sm mb-6 leading-relaxed",
                                  isDone ? "text-slate-600" : "text-slate-400",
                                )}
                              >
                                {node.description}
                              </p>
                              {node.resources && node.resources.length > 0 && (
                                <div className="space-y-2 mt-auto">
                                  {node.resources.map(
                                    (res: any, idx: number) => (
                                      <a
                                        key={idx}
                                        href={res.url}
                                        onClick={(e) => e.stopPropagation()}
                                        className={cn(
                                          "flex items-center justify-between p-3 rounded-xl border transition-all",
                                          isDone
                                            ? "bg-slate-900/30 border-slate-800/50 hover:bg-slate-900/50"
                                            : "bg-slate-900/50 border-slate-800 hover:bg-slate-800",
                                        )}
                                      >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                          {res.type === "video" ? (
                                            <Video className="w-4 h-4 text-slate-400" />
                                          ) : (
                                            <BookOpen className="w-4 h-4 text-slate-400" />
                                          )}
                                          <p className="text-sm font-medium text-slate-300 truncate">
                                            {res.title}
                                          </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-slate-600" />
                                      </a>
                                    ),
                                  )}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Loop back visual indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pl-4 md:pl-24 mt-4 flex items-center gap-4 text-slate-400"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center border border-[var(--border-default)]">
                    <RefreshCw className="w-5 h-5 text-teal-500" />
                  </div>
                  <span className="text-sm font-medium border-b border-dashed border-slate-600 pb-1">
                    Siklus berlanjut ke pengulangan atau materi lanjut...
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="concept_map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Peta Konsep & Prioritas
                </h3>
                <p className="text-slate-400 text-sm">
                  Gunakan peta konsep ini untuk melihat gambaran besar dan
                  hubungan antar materi sebelum Anda mulai mendalami setiap
                  milestone.
                </p>
              </div>
              {data.mermaid_flowchart ? (
                <MermaidViewer chart={data.mermaid_flowchart} />
              ) : (
                <div className="text-center p-16 bg-slate-900/50 rounded-[32px] border border-[var(--border-default)]">
                  <p className="text-slate-400">
                    Peta Konsep belum tersedia untuk roadmap ini.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
