"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, ChevronRight, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6"
    >
      <div className="glass px-6 py-3 rounded-full flex items-center gap-8 shadow-xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">Fren-Edu</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-teal-600 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-teal-600 transition-colors">How it works</Link>
          <Link href="/dashboard" className="hover:text-teal-600 transition-colors">Dashboard</Link>
        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        {status === "loading" ? (
          <div className="w-20 h-8 rounded-full bg-slate-200/50 animate-pulse" />
        ) : session ? (
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-sm font-bold text-teal-700 flex items-center gap-1 hover:text-teal-500 transition-colors"
            >
              <User className="w-4 h-4" />
              Dashboard
            </Link>
            <button 
              onClick={() => signOut()}
              className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="text-sm font-bold text-slate-900 flex items-center gap-1 hover:text-teal-600 transition-colors"
          >
            Sign In
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
