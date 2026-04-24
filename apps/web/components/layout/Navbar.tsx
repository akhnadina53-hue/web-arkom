"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, ChevronRight } from "lucide-react";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6"
    >
      <div className="glass px-6 py-3 rounded-full flex items-center gap-8 shadow-xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Mic className="w-5 h-5 text-slate-950" />
          </div>
          <span className="font-bold text-white tracking-tight">Fren-Edu</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>

        <div className="h-4 w-[1px] bg-slate-800" />

        <Link 
          href="/login" 
          className="text-sm font-bold text-white flex items-center gap-1 hover:text-teal-400 transition-colors"
        >
          Sign In
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.nav>
  );
}
