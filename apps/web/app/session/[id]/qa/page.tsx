"use client";

import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, CheckCircle2, XCircle, ChevronRight, RefreshCw, Trophy, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface QuestionItem {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  hint: string;
}

export default function QAPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQA = async () => {
      try {
        const sessionRes = await fetch(`/api/session/${id}`);
        if (!sessionRes.ok) throw new Error("Failed to fetch session");
        const sessionData = await sessionRes.json();

        if (!sessionData.transcript) {
          throw new Error("Transkrip belum tersedia untuk sesi ini.");
        }

        const response = await fetch("/api/qa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "generate",
            transcript: sessionData.transcript,
            summary: sessionData.summary,
            difficulty: "hard", 
            count: 5,
          }),
        });

        if (!response.ok) throw new Error("Gagal membuat pertanyaan dari AI");
        const jsonResponse = await response.json();
        
        if (jsonResponse.questions && jsonResponse.questions.length > 0) {
          setQuestions(jsonResponse.questions);
        } else {
          throw new Error("AI mengembalikan format yang kosong");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQA();
  }, [id]);

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(option);
    setShowExplanation(true);
    
    if (option === questions[currentIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const isCorrect = selectedAnswer === questions[currentIndex].correct_answer;
    setDirection(isCorrect ? "right" : "left");
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setIsFinished(true);
      }
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <RefreshCw className="w-12 h-12 text-teal-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Meracik Pertanyaan HOTS...</h2>
        <p className="text-slate-400">AI sedang menyusun kuis interaktif dari transkrip Anda.</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Ups, Gagal Memuat Kuis</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <Link href={`/session/${id}`} className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition-colors">
          Kembali ke Sesi
        </Link>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800 border border-slate-700 p-10 rounded-3xl max-w-lg w-full shadow-2xl"
        >
          <Trophy className={cn("w-24 h-24 mx-auto mb-6", percentage >= 60 ? "text-yellow-400" : "text-slate-500")} />
          <h2 className="text-3xl font-bold text-white mb-2">Kuis Selesai!</h2>
          <p className="text-slate-400 mb-6">Kamu berhasil menjawab {score} dari {questions.length} pertanyaan dengan benar.</p>
          
          <div className="text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            {percentage}%
          </div>

          <Link href={`/session/${id}`} className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors w-full">
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Detail Sesi
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Progress Bar */}
      <div className="max-w-xl w-full mb-8">
        <div className="flex justify-between text-sm text-slate-400 font-medium mb-2">
          <span>Pertanyaan {currentIndex + 1} / {questions.length}</span>
          <span>Skor: {score}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-teal-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Deck Container */}
      <div className="relative w-full max-w-xl aspect-[3/4] sm:aspect-square md:aspect-[4/3]">
        <AnimatePresence mode="popLayout">
          {questions.map((q, index) => {
            if (index < currentIndex) return null;

            const isCurrent = index === currentIndex;
            const offset = index - currentIndex;

            return (
              <motion.div
                key={index}
                initial={{ 
                  scale: 0.95, 
                  y: 50, 
                  opacity: 0,
                  rotateZ: (index % 2 === 0 ? 2 : -2)
                }}
                animate={{ 
                  scale: isCurrent ? 1 : 1 - offset * 0.05,
                  y: isCurrent ? 0 : offset * 20,
                  opacity: isCurrent ? 1 : 1 - offset * 0.2,
                  rotateZ: isCurrent ? 0 : (index % 2 === 0 ? 3 : -3),
                  zIndex: questions.length - index
                }}
                exit={{ 
                  x: direction === "right" ? "100vw" : "-100vw", 
                  opacity: 0,
                  rotateZ: direction === "right" ? 15 : -15,
                  transition: { duration: 0.3 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "absolute inset-0 bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden",
                  !isCurrent && "pointer-events-none"
                )}
              >
                {/* Question */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-relaxed">
                  {q.question}
                </h3>

                {/* Options */}
                <div className="space-y-3 mb-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {q.options.map((opt, i) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrect = opt === q.correct_answer;
                    
                    let btnStyle = "bg-slate-700/50 hover:bg-slate-700 text-slate-200 border-slate-600";
                    if (showExplanation) {
                      if (isCorrect) btnStyle = "bg-teal-500/20 border-teal-500 text-teal-300";
                      else if (isSelected && !isCorrect) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                      else btnStyle = "bg-slate-800/50 border-slate-700 text-slate-500 opacity-50"; // faded others
                    }

                    return (
                      <button
                        key={i}
                        disabled={showExplanation}
                        onClick={() => handleSelectAnswer(opt)}
                        className={cn(
                          "w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between group",
                          btnStyle,
                          !showExplanation && "active:scale-[0.98]"
                        )}
                      >
                        <span className="text-base sm:text-lg">{opt}</span>
                        {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />}
                        {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: 20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      className="bg-slate-900/50 border border-slate-700 p-4 rounded-xl mb-4"
                    >
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Footer */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-700/50">
                  {!showExplanation ? (
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Lightbulb className="w-4 h-4" />
                      <span>{q.hint}</span>
                    </div>
                  ) : (
                    <div className="w-full flex justify-end">
                      <button 
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-200 px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
                      >
                        Lanjut
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
