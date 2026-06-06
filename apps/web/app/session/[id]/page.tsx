"use client";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import {
  FileText,
  Brain,
  MessageSquare,
  AudioLines,
  ChevronLeft,
  Download,
  Share2,
  Clock,
  Map,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

type SessionStatus =
  | "UPLOADING"
  | "TRANSCRIBING"
  | "TRANSCRIBED"
  | "SUMMARIZING"
  | "READY"
  | "ERROR";

interface RecordingSession {
  id: string;
  title: string;
  status: SessionStatus;
  duration: number | null;
  language: string;
  transcript: string | null;
  summary: string | null;
  keyPoints: string | null;
  mindMap: string | null;
  createdAt: string;
  updatedAt: string;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "–";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}j ${m}m ${s}d`;
  if (m > 0) return `${m} menit ${s} detik`;
  return `${s} detik`;
}

function countWords(text: string | null): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_CONFIG: Record<
  SessionStatus,
  { label: string; color: string; icon: React.ReactNode; isLoading: boolean }
> = {
  UPLOADING: {
    label: "Mengunggah...",
    color: "text-blue-400 bg-blue-500/10",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    isLoading: true,
  },
  TRANSCRIBING: {
    label: "Sedang transkripsi...",
    color: "text-amber-400 bg-amber-500/10",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    isLoading: true,
  },
  TRANSCRIBED: {
    label: "Transkripsi selesai",
    color: "text-teal-400 bg-teal-500/10",
    icon: <CheckCircle2 className="w-4 h-4" />,
    isLoading: false,
  },
  SUMMARIZING: {
    label: "Membuat ringkasan...",
    color: "text-purple-400 bg-purple-500/10",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    isLoading: true,
  },
  READY: {
    label: "Siap",
    color: "text-emerald-400 bg-emerald-500/10",
    icon: <CheckCircle2 className="w-4 h-4" />,
    isLoading: false,
  },
  ERROR: {
    label: "Gagal",
    color: "text-red-400 bg-red-500/10",
    icon: <AlertCircle className="w-4 h-4" />,
    isLoading: false,
  },
};

export default function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [session, setSession] = useState<RecordingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    async function fetchSession() {
      try {
        const res = await fetch(`/api/session/${id}`);
        if (!res.ok) {
          setError(
            res.status === 404
              ? "Sesi tidak ditemukan."
              : "Gagal memuat data sesi.",
          );
          setLoading(false);
          return;
        }
        const data: RecordingSession = await res.json();
        setSession(data);
        setLoading(false);

        // Stop polling once in a terminal state
        const terminalStates: SessionStatus[] = ["TRANSCRIBED", "READY", "ERROR"];
        if (terminalStates.includes(data.status) && interval) {
          clearInterval(interval);
          interval = null;
        }
      } catch {
        setError("Koneksi gagal. Periksa koneksi internet Anda.");
        setLoading(false);
      }
    }

    fetchSession();

    // Poll every 4 seconds while processing
    interval = setInterval(fetchSession, 4000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id]);

  const statusConfig = session
    ? STATUS_CONFIG[session.status] ?? STATUS_CONFIG.ERROR
    : null;
  const isProcessing = statusConfig?.isLoading ?? true;

  return (
    <div className="min-h-screen text-slate-800">
      <Navbar />

      <main className="max-w-5xl mx-auto pt-32 pb-20 px-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">Back to Library</span>
          </Link>

          {!loading && session && !isProcessing && (
            <div className="flex gap-3">
              <button className="p-3 glass rounded-xl hover:bg-slate-100 transition-colors">
                <Share2 className="w-4 h-4 text-slate-600" />
              </button>
              <button className="p-3 glass rounded-xl hover:bg-slate-100 transition-colors">
                <Download className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="h-12 bg-slate-200 rounded-2xl animate-pulse w-2/3" />
              <div className="h-6 bg-slate-100 rounded-xl animate-pulse w-1/3" />
              <div className="h-64 bg-slate-100 rounded-[32px] animate-pulse" />
            </motion.div>
          )}

          {/* Error State */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-xl font-bold text-slate-800">{error}</p>
              <Link
                href="/dashboard"
                className="text-teal-500 font-semibold text-sm hover:underline"
              >
                Kembali ke Dashboard
              </Link>
            </motion.div>
          )}

          {/* Processing State */}
          {!loading && session && isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 py-24 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
              </div>
              <div>
                <h1 className="text-3xl font-black mb-2 tracking-tighter">
                  {session.title}
                </h1>
                <p className="text-amber-500 font-semibold">
                  {statusConfig?.label}
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Halaman ini akan otomatis diperbarui saat proses selesai...
                </p>
              </div>
              <div className="w-full max-w-sm h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-teal-400 rounded-full"
                  animate={{ x: ["−100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}

          {/* Session Content */}
          {!loading && session && !isProcessing && session.status !== "ERROR" && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Hero Info */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig?.color}`}
                  >
                    {statusConfig?.icon}
                    {statusConfig?.label}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                  {session.title}
                </h1>
                <div className="flex gap-4 text-sm font-medium text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {countWords(session.transcript).toLocaleString()} kata
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDuration(session.duration)}
                  </span>
                  <span className="text-teal-400/50">•</span>
                  <span>Direkam {formatDate(session.createdAt)}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                  {/* Summary Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[32px] p-8 md:p-12"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                        <Brain className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold">Ringkasan AI</h2>
                    </div>
                    {session.summary ? (
                      <div className="prose max-w-none prose-p:text-slate-600 prose-p:leading-relaxed">
                        <p>{session.summary}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-slate-400">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm">
                          Ringkasan belum tersedia. Gunakan tombol{" "}
                          <span className="font-semibold text-teal-500">
                            Generate Summary
                          </span>{" "}
                          untuk membuat ringkasan dari transkrip ini.
                        </p>
                      </div>
                    )}
                  </motion.section>

                  {/* Transcript Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-[32px] p-8 md:p-12"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold">Transkrip Lengkap</h2>
                    </div>
                    {session.transcript ? (
                      <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto pr-2">
                        {session.transcript}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">
                        Transkrip tidak tersedia.
                      </p>
                    )}
                  </motion.section>
                </div>

                {/* Sidebar Tools */}
                <div className="space-y-6">
                  <SectionButton
                    title="Q&A Session"
                    desc="Uji pemahamanmu dengan pertanyaan AI."
                    icon={<MessageSquare className="w-5 h-5" />}
                    href={`/session/${id}/qa`}
                    color="teal"
                  />
                  <SectionButton
                    title="Learning Roadmap"
                    desc="Ikuti jalur belajar terstruktur."
                    icon={<Map className="w-5 h-5" />}
                    href={`/session/${id}/roadmap`}
                    color="amber"
                  />
                  <SectionButton
                    title="Regenerate Voice"
                    desc="Dengarkan ulang dengan suara AI."
                    icon={<AudioLines className="w-5 h-5" />}
                    href={`/session/${id}/audio`}
                    color="emerald"
                  />

                  <div className="p-8 glass rounded-[32px] bg-teal-500/5 border-teal-500/20">
                    <h3 className="text-teal-400 font-bold mb-2">Pro Tip</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Ekspor sesi ini sebagai PDF atau Markdown untuk workflow
                      Notability atau Obsidian-mu.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Session State */}
          {!loading && session && session.status === "ERROR" && (
            <motion.div
              key="session-error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 py-24 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black mb-2">{session.title}</h1>
                <p className="text-red-400 font-semibold">
                  Terjadi kesalahan saat memproses audio.
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Silakan coba upload ulang file audio Anda.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-teal-500 text-white font-bold rounded-xl text-sm hover:bg-teal-600 transition-colors"
              >
                Kembali ke Dashboard
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SectionButton({ title, desc, icon, href, color }: any) {
  const colorMap: any = {
    teal: "text-teal-400 bg-teal-400/5 group-hover:bg-teal-400/10",
    emerald: "text-emerald-400 bg-emerald-400/5 group-hover:bg-emerald-400/10",
    amber: "text-amber-400 bg-amber-400/5 group-hover:bg-amber-400/10",
  };

  return (
    <Link href={href} className="block group">
      <div className="glass p-6 rounded-[28px] group-hover:-translate-y-1 transition-all border-slate-200 group-hover:border-slate-300">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${colorMap[color]}`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </Link>
  );
}
