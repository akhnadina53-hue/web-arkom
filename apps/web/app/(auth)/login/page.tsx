"use client";

import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <AuthCard 
      title="Welcome back" 
      description="Sign in to continue your learning journey"
    >
      <div className="space-y-4">
        <button 
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center group gap-3 border border-slate-200 shadow-sm"
        >
          <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
              <input 
                type="email" 
                placeholder="yours@example.com"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all font-inter"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Link href="#" className="text-xs text-teal-400 hover:text-teal-300 transition-colors">Forgot password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all font-inter"
              />
            </div>
          </div>

          <button className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center group gap-2 mt-2">
            Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      <div className="mt-8 text-center pt-6 border-t border-slate-800/50">
        <p className="text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-teal-400 font-semibold hover:text-teal-300">Create one</Link>
        </p>
      </div>
    </AuthCard>
  );
}
