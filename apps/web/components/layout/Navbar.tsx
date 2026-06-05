"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ChevronRight, LogOut, User, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCallback, useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
      e.preventDefault();
      setMobileMenuOpen(false);
      const target = document.getElementById(anchor);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        router.push(`/#${anchor}`);
      }
    },
    [router],
  );

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6"
      >
        <div className="glass px-4 md:px-6 py-3 rounded-full flex items-center gap-4 md:gap-8 shadow-xl w-full max-w-2xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #5EEAD4, #14B8A6)",
              }}
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Mic className="w-4 h-4 text-white" />
            </motion.div>
            <span
              className="font-extrabold tracking-tight text-sm md:text-base"
              style={{
                background: "linear-gradient(135deg,#14B8A6,#5EEAD4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Fren-Edu
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 flex-1">
            <a
              href="#features"
              onClick={(e) => handleAnchorClick(e, "features")}
              className="transition-colors cursor-pointer hover:font-semibold"
              style={{ color: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleAnchorClick(e, "how-it-works")}
              className="transition-colors cursor-pointer"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              How it works
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleAnchorClick(e, "pricing")}
              className="transition-colors cursor-pointer"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              Pricing
            </a>
          </div>

          <div className="hidden md:block h-4 w-[1px] bg-slate-200 shrink-0" />

          {/* Auth State — Desktop */}
          <div className="hidden md:flex items-center">
            {status === "loading" ? (
              <div className="w-20 h-8 rounded-full bg-slate-200/50 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-bold flex items-center gap-1.5 transition-colors"
                  style={{ color: "#14B8A6" }}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-bold text-slate-800 flex items-center gap-1 transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4895EF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              >
                Sign In
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden ml-auto text-slate-600 hover:text-teal-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-4 right-4 z-40 glass rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
          >
            <a
              href="#features"
              onClick={(e) => handleAnchorClick(e, "features")}
              className="text-slate-700 font-semibold text-base hover:text-teal-600 transition-colors py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleAnchorClick(e, "how-it-works")}
              className="text-slate-700 font-semibold text-base hover:text-teal-600 transition-colors py-1"
            >
              How it works
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleAnchorClick(e, "pricing")}
              className="text-slate-700 font-semibold text-base hover:text-teal-600 transition-colors py-1"
            >
              Pricing
            </a>

            <div className="h-[1px] bg-slate-200 my-1" />

            {status === "loading" ? (
              <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
            ) : session ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 font-bold rounded-2xl transition-colors"
                  style={{
                    background: "rgba(20,184,166,0.12)",
                    color: "#115E59",
                  }}
                >
                  <User className="w-4 h-4" />
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-red-500 font-semibold rounded-2xl hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-white font-bold rounded-2xl transition-colors shadow-lg"
                  style={{
                    background: "linear-gradient(135deg,#14B8A6,#5EEAD4)",
                    boxShadow: "0 6px 20px rgba(13,148,136,0.25)",
                  }}
                >
                  Sign In
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 glass text-teal-700 font-bold rounded-2xl hover:bg-white/80 transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
