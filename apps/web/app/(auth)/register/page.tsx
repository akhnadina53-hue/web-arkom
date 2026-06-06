"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

function InputField({
  icon: Icon,
  type,
  placeholder,
  label,
  value,
  onChange,
  required = true,
}: {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-sm font-medium ml-1"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </label>
      <div className="relative group">
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
          style={{ color: "var(--text-tertiary)" }}
        />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full rounded-2xl py-3 pl-11 pr-4 text-sm transition-all outline-none"
          style={{
            background: "var(--bg-elevated)",
            border: "1.5px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--border-focus)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Panggil API Register
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal melakukan registrasi");
      }

      // Jika sukses, langsung login dengan credentials
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        throw new Error("Gagal auto-login setelah register");
      }

      // Redirect ke dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Mulai perjalananmu 🚀"
      description="Daftar menggunakan email kampus (.edu / .ac.id) untuk status pelajar otomatis."
    >
      {/* Google — cara utama */}
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all mb-6"
        style={{
          background: "#ffffff",
          border: "1.5px solid var(--border-default)",
          color: "var(--text-primary)",
          boxShadow: "var(--shadow-md)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--border-brand)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "var(--shadow-lg), var(--shadow-glow-sm)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--border-default)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "var(--shadow-md)";
        }}
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Daftar dengan Google
      </motion.button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex-1 h-px"
          style={{ background: "var(--border-default)" }}
        />
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          atau daftar dengan email
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "var(--border-default)" }}
        />
      </div>

      {/* Form fields */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          icon={User}
          type="text"
          placeholder="Nama Lengkap"
          label="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          icon={Mail}
          type="email"
          placeholder="mahasiswa@kampus.ac.id"
          label="Alamat Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          icon={Lock}
          type="password"
          placeholder="••••••••"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-sm text-center text-red-500 font-medium">
            {error}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full font-bold py-3.5 rounded-2xl mt-2 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background:
              "linear-gradient(135deg, var(--color-smurf-300) 0%, var(--color-smurf-400) 100%)",
            color: "var(--color-smurf-100)",
            boxShadow: "var(--shadow-md), var(--shadow-glow-sm)",
          }}
        >
          {isLoading ? "Memproses..." : "Create Student.id 🎓"}
          {!isLoading && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </motion.button>
      </form>

      {/* Footer */}
      <div
        className="mt-8 pt-6 flex flex-col items-center gap-3"
        style={{ borderTop: "1px solid var(--border-default)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold transition-colors"
            style={{ color: "var(--text-brand)" }}
          >
            Masuk di sini
          </Link>
        </p>
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          <Sparkles
            className="w-3.5 h-3.5"
            style={{ color: "var(--brand-primary)" }}
          />
          <span>Fren-Edu AI — Powered by Groq &amp; Whisper</span>
        </div>
      </div>
    </AuthCard>
  );
}
