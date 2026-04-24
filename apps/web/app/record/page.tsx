"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Mic, Square, Save, Trash2, Languages, Clock, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <main className="pt-32 pb-12 px-6 max-w-5xl mx-auto flex flex-col items-center">
        {/* Studio Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-12"
        >
          <div className={cn(
            "w-2 h-2 rounded-full",
            isRecording ? "bg-red-500 animate-pulse" : "bg-slate-700"
          )} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500">
            {isRecording ? "Rec Mode Active" : "Studio Standby"}
          </span>
        </motion.div>

        {/* Timer Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 text-center"
        >
          <div className="text-8xl md:text-9xl font-black font-mono tracking-tighter text-white tabular-nums">
            {formatTime(duration)}
          </div>
        </motion.div>

        {/* Visualizer Placeholder */}
        <div className="w-full h-32 flex items-center justify-center gap-1 mb-20 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ 
                height: isRecording ? [20, Math.random() * 80 + 20, 20] : 10,
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.5 + Math.random() * 0.5,
              }}
              className="w-1.5 bg-teal-500/40 rounded-full"
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => {
              if (isRecording) {
                setIsRecording(false);
              } else {
                setDuration(0);
                setIsRecording(true);
              }
            }}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl relative group",
              isRecording 
                ? "bg-slate-900 border-2 border-red-500 text-red-500" 
                : "bg-teal-500 text-slate-950"
            )}
          >
            {isRecording ? (
              <Square className="w-8 h-8 fill-current" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
            
            {/* Hover Glow */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none",
              isRecording ? "bg-red-500" : "bg-teal-500"
            )} />
          </button>
        </div>

        {/* Secondary Options */}
        <AnimatePresence>
          {!isRecording && duration > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 flex gap-4"
            >
              <button className="px-8 py-3.5 glass hover:bg-emerald-500/10 text-emerald-400 font-bold rounded-2xl transition-all flex items-center gap-2">
                <Save className="w-5 h-5" />
                Process & Save
              </button>
              <button 
                onClick={() => setDuration(0)}
                className="px-8 py-3.5 glass hover:bg-red-500/10 text-red-400 font-bold rounded-2xl transition-all flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Discard
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Bar */}
        <div className="mt-auto pt-20 flex gap-6 text-slate-500 text-sm font-medium">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
            <Languages className="w-4 h-4" />
            Indonesian (Auto)
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
            <Settings2 className="w-4 h-4" />
            Groq Whisper V3
          </div>
        </div>
      </main>
    </div>
  );
}
