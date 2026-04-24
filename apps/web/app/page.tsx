"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Mic, Zap, Brain, Sparkles, ArrowRight, Play } from "lucide-react";

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-teal-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-teal-500/20 blur-[120px] rounded-full rotate-12" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full -rotate-12" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-xs font-bold tracking-widest uppercase text-teal-400 border-teal-500/20"
          >
            <Sparkles className="w-3 h-3" />
            Empowering Education with AI
          </motion.div>

          <motion.h1 
            {...fadeInUp}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05]"
          >
            Voice to <br />
            <span className="text-gradient">Knowledge.</span>
          </motion.h1>

          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed"
          >
            Transform your lectures, meetings, and ideas into structured notes, 
            interactive Q&A sessions, and high-quality mind maps instantly.
          </motion.p>

          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/register" 
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/record" 
              className="px-8 py-4 glass hover:bg-white/5 text-white font-bold rounded-2xl transition-all flex items-center gap-2 group"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Mic className="w-6 h-6 text-teal-400" />}
              title="Crystal Clear Record"
              description="Capture every word with our high-fidelity web recording engine, optimized for long sessions."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-emerald-400" />}
              title="Instant Transcription"
              description="Powered by Groq-Whisper for near-instant results. Support for multi-lingual detection."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Brain className="w-6 h-6 text-cyan-400" />}
              title="Semantic Learning"
              description="AI extracts key insights, generates summaries, and creates interactive Q&A for testing."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10 leading-tight">
            Ready to learn <br className="md:hidden" /> smarter, not harder?
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto relative z-10">
            Join thousands of students and professionals who are already transforming their productivity with Fren-Edu.
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-950 font-extrabold rounded-2xl hover:bg-slate-100 transition-colors relative z-10"
          >
            Create Your Free Account
            <Sparkles className="w-5 h-5 text-teal-600" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
              <Mic className="w-3 h-3 text-slate-950" />
            </div>
            <span className="font-bold text-white tracking-tight">Fren-Edu</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Fren-Edu. Built with ❤️ for students.
          </p>
          <div className="flex gap-6 text-slate-500 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Github</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-8 glass rounded-3xl group hover:border-teal-500/30 transition-all hover:-translate-y-2"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
