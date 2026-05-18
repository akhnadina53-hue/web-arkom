"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import {
  Mic, Zap, Brain, Sparkles, ArrowRight, CheckCircle2,
  Quote, GraduationCap, Globe, FileText, Layers, ShieldCheck, Star
} from "lucide-react";
import { useSession } from "next-auth/react";

const SF = {
  primary: "var(--color-smurf-300)",
  secondary: "var(--color-smurf-400)",
  bg: "var(--bg-page)",
  accent: "var(--color-snitch-400)",
};

function GradientOrb({ className, color }: { className: string; color: string }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ background: color, filter: "blur(90px)", opacity: 0.28 }}
    />
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const stagger: Variants = {
  hidden: { transition: {} },
  show: { transition: { staggerChildren: 0.13 } },
};

const FEATURES = [{
    icon: Mic,
    title: "Crystal Recording",
    desc: "High-fidelity browser recording optimized for long lectures, meetings, and seminars.",
    color: SF.secondary
  },
  {
    icon: Zap,
    title: "Instant Transcription",
    desc: "Groq Whisper converts speech to text in seconds with multi-lingual detection support.",
    color: SF.accent
  },
  {
    icon: Brain,
    title: "Semantic Summaries",
    desc: "AI extracts key insights, generates bullet summaries, and creates structured notes.",
    color: SF.primary
  },
  {
    icon: Layers,
    title: "Mind Map Generator",
    desc: "Auto-generate visual mind maps from your transcripts for better conceptual understanding.",
    color: "#b8a7d7"
  },
  {
    icon: FileText,
    title: "Interactive Q&A",
    desc: "Quiz yourself with AI-generated questions directly from your lecture content.",
    color: "#d7c5a7"
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    desc: "Your audio is processed securely and auto-deleted per your configured retention policy.",
    color: "#a7c5d7"
  },
];

const STATS = [{
    value: "50K+",
    label: "Active Students"
  },
  {
    value: "2M+",
    label: "Minutes Transcribed"
  },
  {
    value: "98%",
    label: "Accuracy Rate"
  },
  {
    value: "70+",
    label: "Languages Supported"
  },
];

const STEPS = [{
    step: "01",
    title: "Record or Upload",
    desc: "Use your microphone directly in the browser, or upload an existing audio file from your device."
  },
  {
    step: "02",
    title: "AI Transcribes",
    desc: "Groq Whisper converts your speech to text in seconds — even for Indonesian and regional languages."
  },
  {
    step: "03",
    title: "Learn & Export",
    desc: "Get a clean summary, interactive Q&A, mind map, and export your notes to PDF or share with friends."
  },
];

const TESTIMONIALS = [{
    name: "Alya Rahmawati",
    role: "Mahasiswi Teknik Informatika, UNNES",
    text: "Fren-Edu mengubah cara belajarku. Kuliah 2 jam bisa diringkas jadi 5 poin utama dalam hitungan menit!",
    rating: 5
  },
  {
    name: "Budi Santoso",
    role: "Dosen Ekonomi, UGM",
    text: "Saya gunakan ini untuk merekam diskusi kelas. Transkrip dan ringkasannya sangat akurat, bahkan untuk istilah akademis.",
    rating: 5
  },
  {
    name: "Citra Dewi",
    role: "Mahasiswi Kedokteran, UI",
    text: "Q&A otomatis dari kuliah anatomi membantu saya persiapan ujian. Fitur mind map-nya luar biasa!",
    rating: 5
  },
];

const TECH = [
  {
    name: "Groq",
    desc: "Ultra-fast AI inference",
    logo: "https://cdn.simpleicons.org/groq/white"
  },
  {
    name: "OpenAI",
    desc: "Whisper Transcription",
    logo: "https://cdn.simpleicons.org/openai/white"
  },
  {
    name: "Meta",
    desc: "Llama 3 Models",
    logo: "https://cdn.simpleicons.org/meta/white"
  },
  {
    name: "Next.js",
    desc: "React Framework",
    logo: "https://cdn.simpleicons.org/nextdotjs/white"
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();

  const words = ["Lectures", "Meetings", "Seminars"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const activeWord = words[currentWordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
        setTypingSpeed(75);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => activeWord.slice(0, prev.length + 1));
        setTypingSpeed(150);
      }, typingSpeed);
    }

    if (!isDeleting && currentText === activeWord) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed]);

  const PRICING_PLANS = [
    { name: "Basic", price: "$0", period: "/forever", features: ["3 sessions/month", "Basic summaries", "Standard Q&A", "Community support"], cta: session ? "Current Plan" : "Get Started", href: session ? "/dashboard" : "/login", highlight: false },
    { name: "Pro", price: "$15", period: "/month", features: ["Unlimited sessions", "Advanced AI mind maps", "Custom voice styles", "Export PDF/Word", "Priority support"], cta: "Upgrade to Pro", href: session ? "#" : "/login", highlight: true },
    { name: "Academic", price: "$8", period: "/month", features: ["Requires .edu email", "All Pro features", "Student badge", "Institutional analytics"], cta: "Apply Academic", href: session ? "#" : "/login", highlight: false },
  ];

  const FOOTER_LINKS = [
    { title: "Product", links: ["Features", "Pricing", "Changelog"] },
    { title: "Resources", links: ["Documentation", "Blog", "Support"] },
    { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
  ];

  return (
    <div style={{ background: SF.bg }} className="min-h-screen text-slate-800 dark:text-slate-100 selection:bg-[#A7D7C5]/40 overflow-x-hidden font-sans">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden">
        {/* Ambient orbs */}
        <GradientOrb className="w-[600px] h-[500px] -top-32 -left-40" color={SF.primary} />
        <GradientOrb className="w-[500px] h-[400px] top-20 -right-32" color={SF.secondary} />
        <GradientOrb className="w-[300px] h-[300px] bottom-0 left-1/3" color={SF.accent} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="show" variants={stagger} className="text-center">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold tracking-widest uppercase border" style={{ background: "rgba(167,215,197,0.18)", borderColor: "rgba(167,215,197,0.50)", color: SF.secondary }}>
              <Sparkles className="w-3 h-3" />
              Empowering Education with AI
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] text-slate-800 dark:text-white">
              Transform Your{" "}
              <span className="relative inline-block min-w-[200px] text-left md:min-w-[290px]">
                <span style={{ background: `linear-gradient(135deg, ${SF.secondary}, ${SF.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {currentText || "\u00A0"}
                </span>
                <span className="inline-block w-[3px] h-[0.8em] bg-[var(--color-smurf-400)] ml-1 align-middle animate-pulse" />
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${SF.secondary}, ${SF.primary})`, opacity: 0.5 }} />
              </span>{" "}
              into Knowledge
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 mb-12 leading-relaxed">
              Record. Transcribe. Summarize. Fren-Edu uses AI to turn every lecture, meeting, and seminar
              into structured notes, interactive Q&A, and beautiful mind maps — in seconds.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {status === "loading" ? (
                <div className="w-44 h-14 rounded-2xl animate-pulse" style={{ background: "rgba(167,215,197,0.25)" }} />
              ) : !session ? (
                <>
                  <Link href="/login" className="group px-8 py-4 rounded-2xl font-bold text-white flex items-center gap-2 transition-all shadow-lg" style={{ background: `linear-gradient(135deg, ${SF.secondary}, #5a9a7c)`, boxShadow: `0 8px 24px rgba(116,180,155,0.35)` }}>
                    Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="#features" className="px-8 py-4 rounded-2xl font-bold transition-all border" style={{ background: "rgba(167,215,197,0.12)", borderColor: "rgba(167,215,197,0.40)", color: SF.secondary }}>
                    See How It Works
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="group px-8 py-4 rounded-2xl font-bold text-white flex items-center gap-2 transition-all shadow-lg" style={{ background: `linear-gradient(135deg, ${SF.secondary}, #5a9a7c)`, boxShadow: `0 8px 24px rgba(116,180,155,0.35)` }}>
                    Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/record" className="px-8 py-4 rounded-2xl font-bold transition-all border flex items-center gap-2" style={{ background: "rgba(167,215,197,0.12)", borderColor: "rgba(167,215,197,0.40)", color: SF.secondary }}>
                    <Mic className="w-4 h-4" /> Start Recording
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Floating demo card */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-20 max-w-2xl mx-auto rounded-3xl p-6 border" style={{ background: "var(--bg-card-glass)", backdropFilter: "blur(16px)", borderColor: "var(--border-default)", boxShadow: "0 20px 60px rgba(167,215,197,0.15)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${SF.primary}, ${SF.secondary})` }}>
                <Mic className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Live Transcription</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Detecting: Bahasa Indonesia · Whisper Large v3</p>
              </div>
              <div className="ml-auto flex gap-[3px] h-6 items-end">
                {[100, 60, 80, 45, 90, 55, 70].map((h, i) => (
                  <div key={i} className="w-1.5 rounded-t-sm" style={{ height: `${h}%`, background: i % 2 ? SF.primary : SF.secondary, animation: `full-eq-animate ${0.8 + i * 0.15}s ease-in-out infinite alternate` }} />
                ))}
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-200 text-sm italic leading-relaxed border-l-2 pl-4" style={{ borderColor: SF.primary }}>
              "...sehingga perbedaan mendasar antara kedua teori ini terletak pada pendekatan mereka terhadap struktur data dan kompleksitas algoritmik..."
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {["Ringkasan ✓", "Mind Map ✓", "Q&A ✓", "Ekspor PDF ✓"].map((t) => (
                <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(167,215,197,0.20)", color: SF.secondary }}>{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* DEMO PREVIEW */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-xs font-bold uppercase tracking-widest mb-8"
            style={{ color: SF.secondary }}
          >
            See It In Action
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="rounded-[28px] overflow-hidden bg-white"
            style={{ boxShadow: "0 24px 80px rgba(167,215,197,0.22), 0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <motion.div
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="cursor-zoom-in text-slate-800"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full" style={{ background: SF.primary, opacity: 0.85 }} />
                </div>
                <div className="flex-1 mx-3 px-3 py-1 rounded-lg text-xs text-slate-400 text-center animate-pulse bg-slate-100/50 border border-slate-200">
                  fren-edu.app/record
                </div>
                <div className="w-3 h-3 rounded-full" style={{ background: SF.accent, opacity: 0.6 }} />
              </div>

              {/* App mockup */}
              <div className="relative p-6 md:p-8 bg-slate-50 min-h-[360px]">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: SF.primary, filter: "blur(70px)", opacity: 0.18 }} />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Recorder */}
                  <div className="md:col-span-1 rounded-2xl p-5 flex flex-col items-center justify-center gap-4 bg-white border border-slate-200">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full animate-ping" style={{ background: `${SF.primary}44` }} />
                      <div className="w-16 h-16 rounded-full flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${SF.secondary}, ${SF.primary})`, boxShadow: `0 8px 24px rgba(116,180,155,0.40)` }}>
                        <Mic className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700">Recording…</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">00:12:47</p>
                    </div>
                    <div className="flex gap-[3px] h-8 items-center">
                      {[55,80,45,100,60,85,40,75,50,90,65].map((h, i) => (
                        <div key={i} className="w-1.5 rounded-full" style={{ height: `${h}%`, background: i % 2 ? SF.primary : SF.secondary, animation: `full-eq-animate ${0.6 + i * 0.12}s ease-in-out infinite alternate` }} />
                      ))}
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full font-bold bg-[#A7D7C5]/20 text-[#5a9a7c]">Whisper Large v3</span>
                  </div>

                  {/* Transcript + Summary */}
                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="rounded-2xl p-5 flex-1 bg-white border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: SF.secondary }} />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a9a7c]">Live Transcript</p>
                      </div>
                      {[
                        "Baik, jadi yang pertama kita bahas adalah konsep polymorphism dalam OOP…",
                        "Polymorphism memungkinkan satu interface untuk digunakan berbagai tipe data berbeda…",
                        "Ada dua jenis: compile-time polymorphism dan runtime polymorphism…",
                      ].map((line, i) => (
                        <p key={i} className="text-xs text-slate-600 leading-relaxed mb-1.5 pl-3 border-l" style={{ borderColor: i === 2 ? SF.accent : SF.primary, opacity: i === 2 ? 1 : 0.65 }}>
                          {line}
                        </p>
                      ))}
                      <div className="flex items-center gap-1 mt-2">
                        <span className="inline-block w-1 h-4 rounded-full animate-pulse" style={{ background: SF.secondary }} />
                        <span className="text-xs text-slate-400 italic">mengetik…</span>
                      </div>
                    </div>
                    <div className="rounded-2xl p-4 bg-[#A7D7C5]/10 border border-slate-200">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-[#5a9a7c]">AI Summary — 3 Key Points</p>
                      <div className="space-y-2">
                        {["Polymorphism = satu interface, banyak implementasi","Compile-time: method overloading","Runtime: method overriding via inheritance"].map((pt, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#5a9a7c]" />
                            <p className="text-xs text-slate-600">{pt}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <p className="text-center text-xs text-slate-400 mt-4">
            Hover untuk zoom · Klik untuk mengecilkan · Diproses real-time di browser
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <motion.div key={label} variants={fadeUp} className="text-center p-6 rounded-2xl border" style={{ background: "rgba(167,215,197,0.08)", borderColor: "var(--border-default)" }}>
                <p className="text-3xl font-extrabold mb-1" style={{ background: `linear-gradient(135deg, ${SF.secondary}, ${SF.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 relative overflow-hidden">
        <GradientOrb className="w-[400px] h-[400px] -right-32 top-0" color={SF.primary} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: SF.secondary }}>Everything You Need</p>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Built for serious learners</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Every feature is designed to reduce friction between learning and understanding.</p>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <motion.div key={title} variants={fadeUp} whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="p-6 rounded-2xl border cursor-default bg-white shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: "var(--border-default)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${color}22` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
        <GradientOrb className="w-[500px] h-[400px] -left-40 top-10" color={SF.secondary} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: SF.secondary }}>Simple Process</p>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">From recording to insight in 3 steps</h2>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ step, title, desc }, i) => (
              <motion.div key={step} variants={fadeUp} className="relative p-8 rounded-3xl border bg-white shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: "var(--border-default)" }}>
                <span className="absolute top-6 right-6 text-5xl font-black select-none" style={{ color: "rgba(167,215,197,0.25)" }}>{step}</span>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-5" style={{ background: `linear-gradient(135deg, ${SF.secondary}, ${SF.primary})` }}>{i + 1}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 relative overflow-hidden">
        <GradientOrb className="w-[400px] h-[400px] right-0 bottom-0" color={SF.accent} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: SF.secondary }}>Loved by Students</p>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white">What learners are saying</h2>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, rating }) => (
              <motion.div key={name} variants={fadeUp} whileHover={{ y: -4 }} className="p-6 rounded-2xl border relative bg-white shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: "var(--border-default)" }}>
                <Quote className="w-8 h-8 mb-4" style={{ color: SF.primary, opacity: 0.6 }} />
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-1 mb-3">
                  {Array(rating).fill(0).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: SF.accent }} />)}
                </div>
                <p className="font-bold text-slate-800 text-sm">{name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-10" style={{ color: SF.secondary }}>Powered By</p>
          <div className="relative flex overflow-x-hidden" style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
              className="flex whitespace-nowrap gap-28 pr-28 items-center"
            >
              {[...TECH, ...TECH, ...TECH, ...TECH, ...TECH, ...TECH, ...TECH, ...TECH].map(({ name, logo }, idx) => (
                <div key={`${name}-${idx}`} title={name} className="flex items-center opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer">
                  {logo && <img src={logo} alt={name} className="h-14 object-contain" />}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 relative overflow-hidden">
        <GradientOrb className="w-[600px] h-[400px] left-1/2 -translate-x-1/2 top-0" color={SF.primary} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: SF.secondary }}>Simple Pricing</p>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Start free, upgrade when ready</h2>
            <p className="text-slate-500 dark:text-slate-400">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {PRICING_PLANS.map(({ name, price, period, features, cta, href, highlight }) => (
              <motion.div key={name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-8 rounded-3xl border flex flex-col bg-white ${highlight ? "md:-translate-y-4 shadow-xl" : "shadow-sm"}`} style={{ borderColor: highlight ? SF.primary : "var(--border-default)" }}>
                {highlight && <div className="text-center mb-4"><span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: `linear-gradient(135deg,${SF.secondary},${SF.primary})` }}>Most Popular</span></div>}
                <h3 className="text-xl font-bold text-slate-700 mb-1">{name}</h3>
                <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-extrabold text-slate-900">{price}</span><span className="text-slate-500 text-sm">{period}</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: SF.secondary }} />{f}
                    </li>
                  ))}
                </ul>
                <Link href={href} className="w-full py-3 rounded-2xl text-center font-bold transition-all text-sm" style={highlight ? { background: `linear-gradient(135deg,${SF.secondary},${SF.primary})`, color: "white", boxShadow: `0 8px 24px rgba(116,180,155,0.30)` } : { background: "white", color: SF.secondary, border: `1px solid rgba(167,215,197,0.50)` }}>{cta}</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto rounded-[40px] p-16 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, rgba(167,215,197,0.25), rgba(116,180,155,0.15))`, border: "1px solid rgba(167,215,197,0.40)", boxShadow: "0 20px 80px rgba(167,215,197,0.20)" }}>
          <GradientOrb className="w-[400px] h-[400px] -top-20 left-1/2 -translate-x-1/2" color={SF.primary} />
          <div className="relative z-10">
            <GraduationCap className="w-12 h-12 mx-auto mb-6" style={{ color: SF.secondary }} />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 leading-tight">Learn smarter,<br />not harder.</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto">Join thousands of students and professionals transforming how they learn with AI.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-extrabold text-white transition-all" style={{ background: `linear-gradient(135deg,${SF.secondary},#5a9a7c)`, boxShadow: `0 12px 36px rgba(116,180,155,0.40)` }}>
              Create Free Account <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: "var(--border-default)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg,${SF.primary},${SF.secondary})` }}>
                  <Mic className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-extrabold text-slate-800 dark:text-white">Fren-Edu</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">AI-powered learning companion for students and professionals.</p>
            </div>
            {FOOTER_LINKS.map(({ title, links }) => (
              <div key={title}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: SF.secondary }}>{title}</p>
                <ul className="space-y-2">
                  {links.map((l) => <li key={l}><Link href="#" className="text-sm text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 transition-colors">{l}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t" style={{ borderColor: "var(--border-default)" }}>
            <p className="text-xs text-slate-400 dark:text-slate-500">© 2026 Fren-Edu. Built with ❤️ for everywhere.</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              <span>Available in 70+ languages</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
