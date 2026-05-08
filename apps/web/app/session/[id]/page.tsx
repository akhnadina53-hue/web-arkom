"use client";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FileText, Brain, MessageSquare, AudioLines, ChevronLeft, Download, Share2, Clock } from "lucide-react";
import Link from "next/link";

export default function SessionPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto pt-32 pb-20 px-6">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">Back to Library</span>
          </Link>
          
          <div className="flex gap-3">
            <button className="p-3 glass rounded-xl hover:bg-white/5 transition-colors">
              <Share2 className="w-4 h-4 text-slate-400" />
            </button>
            <button className="p-3 glass rounded-xl hover:bg-white/5 transition-colors">
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Hero Info */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Physics: Einstein's Core Theories</h1>
          <div className="flex gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> 1,240 words</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 42 minutes</span>
            <span className="text-teal-400/50">•</span>
            <span>Recorded April 24, 2026</span>
          </div>
        </div>

        {/* Content Tabs-like Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Reading Area */}
          <div className="lg:col-span-2 space-y-12">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[32px] p-8 md:p-12"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Brain className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">AI Summary</h2>
              </div>
              <div className="prose prose-invert max-w-none prose-p:text-slate-400 prose-p:leading-relaxed">
                <p>
                  This lecture covers the fundamental aspects of General Relativity, focusing on how mass warps spacetime 
                  and the implications of time dilation near massive objects...
                </p>
                {/* More paragraphs would go here */}
              </div>
            </motion.section>

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
                <h2 className="text-2xl font-bold">Full Transcript</h2>
              </div>
              <div className="space-y-6 text-slate-400 font-mono text-sm leading-relaxed">
                <p><span className="text-slate-600 mr-4">00:00</span> Good morning everyone, today we will dive into the fascinating world of relativity...</p>
                <p><span className="text-slate-600 mr-4">05:22</span> Imagine a trampoline with a heavy ball in the center. The curve it makes is what gravity is...</p>
              </div>
            </motion.section>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-6">
            <SectionButton 
              title="Q&A Session"
              desc="Test your knowledge with AI questions."
              icon={<MessageSquare className="w-5 h-5" />}
              href={`/session/${params.id}/qa`}
              color="teal"
            />
            <SectionButton 
              title="Regenerate Voice"
              desc="Listen to a clean AI voiceover."
              icon={<AudioLines className="w-5 h-5" />}
              href={`/session/${params.id}/audio`}
              color="emerald"
            />
            
            <div className="p-8 glass rounded-[32px] bg-teal-500/5 border-teal-500/20">
              <h3 className="text-teal-400 font-bold mb-2">Pro Tip</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You can export this session as a PDF or Markdown for your Notability or Obsidian workflow.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionButton({ title, desc, icon, href, color }: any) {
  const colorMap: any = {
    teal: "text-teal-400 bg-teal-400/5 group-hover:bg-teal-400/10",
    emerald: "text-emerald-400 bg-emerald-400/5 group-hover:bg-emerald-400/10"
  };

  return (
    <Link href={href} className="block group">
      <div className="glass p-6 rounded-[28px] group-hover:-translate-y-1 transition-all border-white/5 group-hover:border-white/10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${colorMap[color]}`}>
          {icon}
        </div>
        <h3 className="font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </Link>
  );
}
