"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { modalBackdrop, modalPanel, badgeReveal } from "@/lib/motion/variants";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";
import { triggerParticleBurst } from "@/lib/motion/particles";
import { OTPInput } from "./OTPInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { X, Mail, ShieldCheck, Award } from "lucide-react";

type Step = 1 | 2 | 3;

interface VerifyStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with email when user submits step 1 */
  onSendOTP?: (email: string) => Promise<void>;
  /** Called with OTP code when user submits step 2 */
  onVerifyOTP?: (code: string) => Promise<boolean>;
}

export function VerifyStudentModal({
  isOpen,
  onClose,
  onSendOTP,
  onVerifyOTP,
}: VerifyStudentModalProps) {
  const shouldReduceMotion = useAppReducedMotion();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState<"idle" | "error" | "success">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = useCallback(async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      if (onSendOTP) {
        await onSendOTP(email);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
      setStep(2);
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email, onSendOTP]);

  const handleVerifyOTP = useCallback(async () => {
    if (otp.length < 6) return;
    setIsLoading(true);
    setOtpStatus("idle");
    try {
      let success = false;
      if (onVerifyOTP) {
        success = await onVerifyOTP(otp);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        success = otp === "123456";
      }

      if (success) {
        setOtpStatus("success");
        setTimeout(() => {
          setStep(3);
          if (!shouldReduceMotion) {
            triggerParticleBurst();
          }
        }, 600);
      } else {
        setOtpStatus("error");
        setError("Invalid verification code. Please try again.");
        setTimeout(() => setOtpStatus("idle"), 1500);
      }
    } catch {
      setOtpStatus("error");
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [otp, onVerifyOTP, shouldReduceMotion]);

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setOtpStatus("idle");
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={shouldReduceMotion ? undefined : modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50"
            style={{ background: "var(--bg-overlay)" }}
            onClick={handleClose}
          />

          {/* Panel — Glassmorphism */}
          <motion.div
            variants={shouldReduceMotion ? undefined : modalPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-md rounded-3xl p-6 sm:p-8 relative"
              style={{
                background: "var(--bg-card-glass)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(167,215,197,0.30)",
                boxShadow: "var(--shadow-glow-lg)",
              }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Step 1: Email */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: "var(--color-smurf-100)",
                        color: "var(--color-smurf-600)",
                      }}
                    >
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                        Verify Student Email
                      </h2>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        Enter your university email address
                      </p>
                    </div>
                  </div>

                  <Input
                    type="email"
                    label="University Email"
                    placeholder="you@university.ac.id"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    error={error}
                  />

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSendOTP}
                    isLoading={isLoading}
                    disabled={!email}
                  >
                    Send Verification Code
                  </Button>
                </div>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: "var(--color-smurf-100)",
                        color: "var(--color-smurf-600)",
                      }}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                        Enter Verification Code
                      </h2>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        We sent a 6-digit code to {email}
                      </p>
                    </div>
                  </div>

                  <OTPInput
                    value={otp}
                    onChange={(v) => { setOtp(v); setError(""); setOtpStatus("idle"); }}
                    status={otpStatus}
                    disabled={isLoading}
                  />

                  {error && (
                    <p className="text-xs text-center font-medium" style={{ color: "var(--error)" }}>
                      {error}
                    </p>
                  )}

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleVerifyOTP}
                    isLoading={isLoading}
                    disabled={otp.length < 6}
                  >
                    Verify
                  </Button>

                  <button
                    onClick={() => { setStep(1); setOtp(""); setError(""); }}
                    className="w-full text-center text-sm font-medium transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    ← Change email
                  </button>
                </div>
              )}

              {/* Step 3: Success + Badge reveal */}
              {step === 3 && (
                <div className="space-y-6 text-center py-4">
                  <motion.div
                    variants={shouldReduceMotion ? undefined : badgeReveal}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-center"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, var(--color-smurf-300), var(--color-smurf-400))",
                        boxShadow: "var(--shadow-glow-lg)",
                      }}
                    >
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  <div>
                    <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--text-primary)" }}>
                      Verified! 🎉
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Your student status has been confirmed
                    </p>
                  </div>

                  <Badge variant="success" animated icon={<ShieldCheck className="w-3 h-3" />}>
                    VERIFIED STUDENT
                  </Badge>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleClose}
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
