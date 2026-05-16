"use client";

import { signIn } from "next-auth/react";
import { Mic, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F6FBF9] flex items-center justify-center p-6 overflow-hidden relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] pointer-events-none opacity-50">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[60%] rounded-full rotate-12" style={{background:"#A7D7C5",filter:"blur(120px)",opacity:0.35}} />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[50%] rounded-full -rotate-12" style={{background:"#F4A261",filter:"blur(120px)",opacity:0.18}} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass w-full max-w-md p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,209,178,0.1)] relative z-10 border border-white/50"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ y: -4, scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-center w-14 h-14 rounded-2xl mb-6 shadow-lg cursor-pointer"
            style={{ background: "linear-gradient(135deg, #A7D7C5, #74B49B)", boxShadow: "0 8px 24px rgba(116,180,155,0.35)" }}
          >
            <Mic className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-center text-sm">
            Sign in to access your transcriptions and mind maps.
          </p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-4 px-6 bg-white border border-[rgba(167,215,197,0.40)] rounded-xl flex items-center justify-center gap-3 text-slate-700 font-semibold hover:bg-[rgba(167,215,197,0.06)] hover:border-[#A7D7C5] hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(167,215,197,0.40)]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5" style={{color:"#74B49B"}} />
          <span>Fren-Edu AI Engine — Powered by Groq &amp; Whisper</span>
        </div>
      </motion.div>
    </div>
  );
}
