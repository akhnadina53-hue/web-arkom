"use client";
import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, Map, Download, Share2, BookOpen, Video, ExternalLink, CheckCircle2, Circle, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { RoadmapData } from "@/types/roadmap";

// Mock Data for the Roadmap
const MOCK_ROADMAP: RoadmapData = {
  title: "Physics: Einstein's Core Theories",
  estimatedTotalTime: "8-12 hours",
  topics_extracted: ["Relativity", "Time Dilation", "Gravity", "Spacetime"],
  legend: [
    { type: "core", emoji: "📗", label: "Dari Materi", color: "#52B788" },
    { type: "prerequisite", emoji: "📘", label: "Wajib Dipahami", color: "#5B9BD5" },
    { type: "practice", emoji: "📕", label: "Latihan/Aplikasi", color: "#E05C5C" },
    { type: "reflection", emoji: "🔄", label: "Refleksi", color: "#F4A261" },
    { type: "advanced", emoji: "🔗", label: "Lanjutan", color: "#A89BD9" }
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
          description: "Memahami gaya, gravitasi Newton, dan kerangka acuan inersia.",
          difficulty: "beginner",
          estimatedTime: "2 jam",
          order: 1,
          resources: [
            { title: "Khan Academy: Physics", url: "#", type: "course", isPaid: false }
          ]
        },
        {
          id: "n2",
          label: "Sistem Koordinat 3D & Waktu",
          type: "prerequisite",
          source: "ai_recommended",
          description: "Membiasakan diri dengan dimensi ruang dan waktu sebagai variabel terpisah.",
          difficulty: "beginner",
          estimatedTime: "1 jam",
          order: 2
        }
      ]
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
          description: "Cahaya sama cepatnya dari semua kerangka acuan pengamat.",
          difficulty: "intermediate",
          estimatedTime: "1 jam",
          order: 1
        },
        {
          id: "n4",
          label: "Time Dilation (Dilasi Waktu)",
          type: "core",
          source: "from_audio",
          description: "Waktu berjalan lebih lambat saat bergerak mendekati kecepatan cahaya.",
          difficulty: "intermediate",
          estimatedTime: "1.5 jam",
          order: 2,
          resources: [
            { title: "MinutePhysics: Time Dilation", url: "#", type: "video", isPaid: false }
          ]
        }
      ]
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
          order: 1
        },
        {
          id: "n6",
          label: "GPS & Relativitas",
          type: "practice",
          source: "from_audio",
          description: "Bagaimana satelit GPS mengoreksi waktu karena gravitasi Bumi.",
          difficulty: "intermediate",
          estimatedTime: "1 jam",
          order: 2
        }
      ]
    },
    {
      number: 4,
      title: "Refleksi Siklus (Continuous Flow)",
      emoji: "🔄",
      description: "Review materi dan menghubungkannya kembali ke paradigma baru fisika",
      nodes: [
        {
          id: "n7",
          label: "Paradigma Bergeser",
          type: "reflection",
          source: "ai_recommended",
          description: "Bagaimana relativitas membatalkan pandangan Newton? Renungkan perbedaannya.",
          difficulty: "beginner",
          estimatedTime: "30 menit",
          order: 1
        },
        {
          id: "n8",
          label: "Menuju Relativitas Umum",
          type: "advanced",
          source: "ai_recommended",
          description: "Persiapan siklus belajar berikutnya: Spacetime curve.",
          difficulty: "advanced",
          estimatedTime: "1 jam",
          order: 2
        }
      ]
    }
  ]
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

export default function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const mockTranscript = "Ini adalah transkrip singkat tentang fisika relativitas khusus, bagaimana kecepatan cahaya konstan bagi semua pengamat, dan konsep dilasi waktu.";

        const response = await fetch("/api/roadmap/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: mockTranscript,
            language: "id",
            content_type: "academic"
          }),
        });

        if (!response.ok) {
          throw new Error("API Route failed");
        }

        const jsonResponse = await response.json();
        setData(jsonResponse);
      } catch (error) {
        console.log("Failed to fetch real AI API, falling back to mock data...", error);
        setData(MOCK_ROADMAP);
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

  if (loading || !data) {
    return (
      <div className="min-h-screen text-slate-800 flex items-center justify-center flex-col gap-6">
        <Map className="w-16 h-16 text-slate-300 animate-pulse" />
        <h2 className="text-xl font-bold animate-pulse text-slate-400">Generating Learning Roadmap...</h2>
      </div>
    );
  }

  const totalNodes = data.sections.reduce((acc, sec) => acc + sec.nodes.length, 0);
  const progressPercent = Math.round((completedNodes.size / totalNodes) * 100);

  return (
    <div className="min-h-screen text-slate-800 pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-32 px-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href={`/session/${id}`}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">Back to Session</span>
          </Link>

          <div className="flex gap-3">
            <button className="p-3 glass rounded-xl hover:bg-slate-100 transition-colors">
              <Share2 className="w-4 h-4 text-slate-600" />
            </button>
            <button className="p-3 glass rounded-xl hover:bg-slate-100 transition-colors">
              <Download className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Roadmap Title & Progress */}
        <div className="glass p-8 md:p-12 rounded-[32px] mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-500">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black">{data.title}</h1>
              <p className="text-slate-500 mt-1">Learning Roadmap • {data.estimatedTotalTime}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-slate-600">Your Progress</span>
              <span className="text-sm font-bold text-slate-400">{completedNodes.size} / {totalNodes} Done ({progressPercent}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-16 px-4">
          {data.legend.map((lg) => (
            <div key={lg.type} className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white shadow-sm border border-slate-100 px-3 py-1.5 rounded-full">
              <span>{lg.emoji}</span>
              {lg.label}
            </div>
          ))}
        </div>

        {/* Circular Timeline Flow */}
        <div className="relative pl-4 md:pl-10">
          {data.sections.map((section, sIdx) => {
            const colorClass = SECTION_COLORS[sIdx % SECTION_COLORS.length];
            const borderClass = SECTION_BORDER_ONLY[sIdx % SECTION_BORDER_ONLY.length];
            const isLast = sIdx === data.sections.length - 1;

            return (
              <div key={section.number} className="relative pb-16">
                {/* Timeline Line */}
                {!isLast && (
                  <div className={`absolute left-0 top-14 bottom-0 w-1 ${borderClass} rounded-full`} />
                )}
                {isLast && (
                  <div className="absolute left-0 top-14 h-32 w-1 border-l-4 border-b-4 border-dashed border-slate-300 rounded-bl-3xl" />
                )}

                {/* Section Header */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sIdx * 0.2 }}
                  className="relative flex items-start gap-6 mb-8"
                >
                  <div className={`absolute -left-[20px] top-2 w-10 h-10 rounded-xl flex items-center justify-center font-bold border-2 bg-white z-10 ${colorClass}`}>
                    {section.number}
                  </div>
                  <div className="pl-10">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      {section.title}
                    </h2>
                    <p className="text-slate-500 mt-2">{section.description}</p>
                  </div>
                </motion.div>

                {/* Nodes inside Section */}
                <div className="pl-10 space-y-6">
                  {section.nodes.map((node, nIdx) => {
                    const isDone = completedNodes.has(node.id);
                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (sIdx * 0.2) + (nIdx * 0.1) }}
                        className={`glass p-6 rounded-3xl transition-all border-2 cursor-pointer
                          ${isDone ? 'border-amber-400 bg-amber-50/50' : 'border-transparent hover:border-slate-200'}`}
                        onClick={() => toggleNode(node.id)}
                      >
                        <div className="flex gap-4 items-start">
                          <button className="mt-1 flex-shrink-0 text-slate-300 hover:text-amber-400 transition-colors">
                            {isDone ? (
                              <CheckCircle2 className="w-6 h-6 text-amber-500" />
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className={`text-lg font-bold ${isDone ? 'text-slate-900 line-through decoration-slate-300' : 'text-slate-900'}`}>
                                {node.label}
                              </h3>
                              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md">
                                {node.estimatedTime}
                              </span>
                              {/* Find matching legend emoji */}
                              <span className="text-sm bg-white shadow-sm border border-slate-100 px-2 py-0.5 rounded text-slate-500" title={node.type}>
                                {data.legend.find(l => l.type === node.type)?.emoji || "📌"}
                              </span>
                            </div>
                            
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                              {node.description}
                            </p>

                            {/* Resources */}
                            {node.resources && node.resources.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                                {node.resources.map((res, idx) => (
                                  <a 
                                    key={idx}
                                    href={res.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                  >
                                    {res.type === 'video' ? <Video className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                                    {res.title}
                                    <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
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
            transition={{ delay: 1 }}
            className="pl-24 mt-4 flex items-center gap-4 text-slate-400"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm font-medium border-b border-dashed border-slate-400 pb-1">Siklus berulang ke topik selanjutnya...</span>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
