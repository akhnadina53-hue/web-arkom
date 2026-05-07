"use client";

import Link from "next/link";
import { motion, Transition } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Mic, Zap, Brain, Sparkles, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const defaultTransition: Transition = { 
    duration: 0.6, 
    ease: [0.16, 1, 0.3, 1] 
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen text-slate-900 selection:bg-teal-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-teal-500/20 blur-[120px] rounded-full rotate-12" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full -rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <div className="text-center md:text-left z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-xs font-bold tracking-widest uppercase text-teal-600 border-teal-500/20 shadow-sm"
            >
              <Sparkles className="w-3 h-3" />
              Empowering Education with AI
            </motion.div>

            <motion.h1 
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={defaultTransition}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05]"
            >
              Voice to <br className="hidden md:block" />
              <span className="text-gradient">Knowledge.</span>
            </motion.h1>

            <motion.p 
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={{ ...defaultTransition, delay: 0.2 }}
              className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-slate-600 mb-10 leading-relaxed"
            >
              Transform your lectures, meetings, and ideas into structured notes, 
              interactive Q&A sessions, and high-quality mind maps instantly.
            </motion.p>

            <motion.div 
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={{ ...defaultTransition, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 h-[60px]"
            >
              {status === "loading" ? (
                <div className="w-full sm:w-[300px] h-14 rounded-2xl bg-slate-200/50 animate-pulse" />
              ) : !session ? (
                <>
                  <Link 
                    href="/login" 
                    className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-teal-500/30 flex items-center gap-2 group w-full sm:w-auto justify-center"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="#features" 
                    className="px-8 py-4 glass hover:bg-white/80 text-teal-700 font-bold rounded-2xl transition-all flex items-center gap-2 group w-full sm:w-auto justify-center shadow-sm"
                  >
                    Learn More
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/dashboard" 
                    className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-teal-500/30 flex items-center gap-2 group w-full sm:w-auto justify-center"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/record" 
                    className="px-8 py-4 glass hover:bg-white/80 text-teal-700 font-bold rounded-2xl transition-all flex items-center gap-2 group w-full sm:w-auto justify-center shadow-sm"
                  >
                    <Mic className="w-4 h-4 text-teal-600" />
                    Start Recording
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Right Column: Visuals (Hidden on Mobile) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden md:flex relative justify-center items-center h-[550px] w-full rounded-3xl overflow-hidden glass shadow-[0_20px_40px_rgba(0,209,178,0.15)] group"
          >
            {/* The glowing orb from original prototype */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 blur-[8px] orb-animate shadow-[0_0_80px_rgba(0,209,178,0.6)] z-10" />
            </div>
            
            {/* Reference banner image (behind the orb) */}
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0MKzP2tjkqA1pWFkJoGR3RccjqNugILLCJyQYRbze_uiftfl7a5C6SsmcAiNiquBZ60a0CpIohIE24Dl-hq72vciAcyA_pypnP4xO2BmHCttAuYbircjKBSO0CIs1_8pXdVFNO4h7_a-U7nIhz9SVSioUG5R5RhvjUzbyx0WnCQxK7qrmi1S09l6tH_Yvu7XqwrNsuS3GsFwxdkzxHAtvc8ZxA1FX4CZ6pfLUekRXi4nP46EsJAYUhf8SKZ1tlg1u3x-S5zIGWQP6" 
              alt="Hero Workspace" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" 
            />

            {/* Floating UI Element from reference */}
            <div className="absolute bottom-6 left-6 right-6 glass p-5 rounded-2xl shadow-xl z-20 border border-white/40 transform transition-transform group-hover:-translate-y-2">
               <div className="flex items-center gap-3 mb-3">
                  <div className="bg-teal-500/20 p-2 rounded-full">
                    <Mic className="w-5 h-5 text-teal-600 animate-pulse" />
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-semibold tracking-wider">Processing Audio...</span>
                  
                  {/* Mini Equalizer */}
                  <div className="flex gap-[3px] ml-auto h-6 items-end">
                     <div className="w-1.5 bg-teal-500 rounded-t-sm h-full animate-[full-eq-animate_1.1s_ease-in-out_infinite_alternate] delay-75"></div>
                     <div className="w-1.5 bg-lime-500 rounded-t-sm h-2/3 animate-[full-eq-animate_0.8s_ease-in-out_infinite_alternate] delay-150"></div>
                     <div className="w-1.5 bg-teal-500 rounded-t-sm h-1/2 animate-[full-eq-animate_1.2s_ease-in-out_infinite_alternate] delay-300"></div>
                     <div className="w-1.5 bg-lime-500 rounded-t-sm h-full animate-[full-eq-animate_0.9s_ease-in-out_infinite_alternate] delay-75"></div>
                     <div className="w-1.5 bg-teal-500 rounded-t-sm h-3/4 animate-[full-eq-animate_1.3s_ease-in-out_infinite_alternate] delay-200"></div>
                  </div>
               </div>
               <p className="text-slate-700 text-sm italic font-medium leading-relaxed">
                  "...so the fundamental difference between these two theories lies in their approach to..."
               </p>
            </div>
          </motion.div>
        </div>

        {/* Full width equalizer at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] flex items-end justify-around overflow-hidden bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-teal-500/5 opacity-60 z-0 px-2 pointer-events-none">
           <div className="w-full flex items-end justify-between opacity-80 h-full max-w-7xl mx-auto">
              {Array.from({ length: 100 }).map((_, i) => (
                 <div 
                   key={i} 
                   className="full-width-eq-bar hidden md:block" 
                   style={{ animationDelay: `${(i % 15) * 0.1}s`, height: `${10 + (i % 5) * 8}px` }}
                 />
              ))}
              {/* Generate fewer bars for mobile to prevent lag */}
              {Array.from({ length: 30 }).map((_, i) => (
                 <div 
                   key={`mob-${i}`} 
                   className="full-width-eq-bar block md:hidden" 
                   style={{ animationDelay: `${(i % 8) * 0.15}s`, height: `${15 + (i % 4) * 6}px` }}
                 />
              ))}
           </div>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Start for free, upgrade when you need more power to unlock advanced features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="glass p-8 rounded-3xl flex flex-col border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-2">Basic</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 font-medium">/forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>3 Transcriptions per month</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>Basic Summaries</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>Standard Support</span>
                </li>
              </ul>
              <Link href={session ? "/dashboard" : "/login"} className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-center transition-colors">
                {session ? "Current Plan" : "Get Started"}
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="glass p-8 rounded-3xl flex flex-col border-2 border-teal-500 relative transform md:-translate-y-4 shadow-2xl shadow-teal-500/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-lime-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-teal-700 mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$15</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>Unlimited Transcriptions</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>Advanced AI Mind Maps</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>Custom AI Voices</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>Export to PDF/Word</span>
                </li>
              </ul>
              <Link href={session ? "#" : "/login"} className="w-full py-3 rounded-2xl bg-teal-600 text-white font-bold hover:bg-teal-500 shadow-lg text-center transition-colors">
                Upgrade to Pro
              </Link>
            </div>

            {/* Academic Plan */}
            <div className="glass p-8 rounded-3xl flex flex-col border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-2">Academic</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$8</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>Requires .edu email</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>All Pro features included</span>
                </li>
              </ul>
              <Link href={session ? "#" : "/login"} className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-center transition-colors">
                Apply for Academic
              </Link>
            </div>
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10 leading-tight">
            Ready to learn <br className="md:hidden" /> smarter, not harder?
          </h2>
          <p className="text-slate-600 mb-10 max-w-xl mx-auto relative z-10">
            Join thousands of students and professionals who are already transforming their productivity with Fren-Edu.
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-teal-600 text-white font-extrabold rounded-2xl hover:bg-teal-500 shadow-lg shadow-teal-500/20 transition-colors relative z-10"
          >
            Create Your Free Account
            <Sparkles className="w-5 h-5 text-white" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
              <Mic className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">Fren-Edu</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Fren-Edu. Built with ❤️ for students.
          </p>
          <div className="flex gap-6 text-slate-500 text-sm">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Github</Link>
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
      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
