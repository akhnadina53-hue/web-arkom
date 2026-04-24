"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Clock, FileText, ChevronRight, Search, Filter } from "lucide-react";

export default function DashboardPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Your Library</h1>
          <p className="text-slate-400">Manage and review your AI-powered study sessions</p>
        </div>
        
        <Link 
          href="/record" 
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 group w-fit"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          New Session
        </Link>
      </div>

      {/* Stats/Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Sessions" value="0" icon={<Clock className="w-4 h-4" />} />
        <StatCard label="Study Hours" value="0h" icon={<FileText className="w-4 h-4" />} />
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors group-focus-within:text-teal-400" />
          <input 
            type="text" 
            placeholder="Search your transcriptions..."
            className="w-full h-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/40 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Content */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={item} className="md:col-span-3">
          <div className="glass rounded-[32px] p-12 text-center border-dashed border-2 border-slate-800 bg-transparent flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6">
              <Plus className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No recordings found</h3>
            <p className="text-slate-400 mb-8 max-w-sm">
              Your library is empty. Start recording your first session to unlock AI-powered insights.
            </p>
            <Link 
              href="/record" 
              className="px-8 py-3.5 glass hover:bg-white/5 text-white font-bold rounded-2xl transition-all"
            >
              Start Recording Now
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="glass p-5 rounded-2xl flex items-center justify-between group hover:border-teal-500/20 transition-all">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/10 transition-colors">
        {icon}
      </div>
    </div>
  );
}
