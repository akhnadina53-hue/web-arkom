"use client";

import { useState } from "react";
import { Mail, Lock, Globe, GraduationCap, CheckCircle2, XCircle } from "lucide-react";
import { SettingsGroup } from "@/components/ui/settings-group";
import { SettingsRow } from "@/components/ui/settings-row";
import { Toggle } from "@/components/ui/toggle";

export default function SettingsAccountPage() {
  const [displayName, setDisplayName] = useState("Your Name");
  const [twoFactor, setTwoFactor] = useState(false);
  const [studentVerified] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  function markDirty() {
    setIsDirty(true);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight" style={{background:"linear-gradient(135deg,#74B49B,#A7D7C5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Account & Security</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your login credentials and account security.</p>
      </div>

      {/* Informasi Akun */}
      <SettingsGroup title="Informasi Akun">
        <SettingsRow
          label="Email"
          description="Your primary login email. Contact support to change."
          htmlFor="email"
        >
          <div className="flex items-center gap-2 bg-[rgba(167,215,197,0.10)] border border-[rgba(167,215,197,0.30)] rounded-xl px-3 py-2 text-sm text-slate-500">
            <Mail className="w-4 h-4 text-[#74B49B]" />
            <span className="font-mono text-xs">user@example.com</span>
          </div>
        </SettingsRow>

        <SettingsRow
          label="Display Name"
          description="Your name shown in sessions and the public profile."
          htmlFor="display_name"
        >
          <input
            id="display_name"
            type="text"
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); markDirty(); }}
            className="bg-white border border-[rgba(167,215,197,0.40)] hover:border-[#A7D7C5] focus:border-[#74B49B] focus:ring-2 focus:ring-[rgba(167,215,197,0.25)] rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all w-48"
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Login & Keamanan */}
      <SettingsGroup title="Login & Keamanan">
        <SettingsRow
          label="Password"
          description="Change your account password."
        >
          <button className="bg-white hover:bg-[rgba(167,215,197,0.12)] border border-[rgba(167,215,197,0.40)] hover:border-[#A7D7C5] text-sm font-semibold text-slate-700 px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-sm">
            <Lock className="w-4 h-4 text-[#74B49B]" />
            Change Password
          </button>
        </SettingsRow>

        <SettingsRow
          label="Google Account"
          description="Connected for sign-in via Google OAuth."
        >
          <div className="flex items-center gap-2 text-sm font-semibold" style={{color:"#74B49B"}}>
            <Globe className="w-4 h-4" />
            Connected
          </div>
        </SettingsRow>

        <SettingsRow
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account."
          htmlFor="two-factor"
        >
          <Toggle
            id="two-factor"
            checked={twoFactor}
            onChange={(v) => { setTwoFactor(v); markDirty(); }}
            aria-label="Two-factor authentication"
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Verifikasi Pelajar */}
      <SettingsGroup
        title="Verifikasi Pelajar"
        description="Verify your student status with an educational email to unlock Q&A and export features."
      >
        <SettingsRow
          label="Status Verifikasi"
          description={studentVerified ? "Email pelajar kamu sudah terverifikasi." : "Belum diverifikasi. Gunakan email .ac.id atau .edu."}
        >
          <div className="flex items-center gap-3">
            {studentVerified ? (
              <span className="flex items-center gap-1.5 text-sm font-semibold" style={{color:"#74B49B"}}>
                <CheckCircle2 className="w-4 h-4" />
                Terverifikasi
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400 text-sm font-semibold">
                <XCircle className="w-4 h-4" />
                Belum Diverifikasi
              </span>
            )}
            <button
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              style={{
                background: "rgba(167,215,197,0.15)",
                border: "1px solid rgba(167,215,197,0.40)",
                color: "#1a3a30",
              }}
            >
              <GraduationCap className="w-4 h-4 inline mr-1.5" />
              Verifikasi Sekarang
            </button>
          </div>
        </SettingsRow>
      </SettingsGroup>

      {/* Save Bar */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-md border border-[rgba(167,215,197,0.50)] rounded-2xl px-5 py-3 shadow-xl shadow-[rgba(167,215,197,0.20)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-sm text-slate-600 font-medium">Perubahan belum disimpan</p>
          <button onClick={() => setIsDirty(false)} className="text-sm text-slate-400 hover:text-slate-700 font-semibold transition-colors">
            Batal
          </button>
          <button onClick={() => setIsDirty(false)} className="btn-save text-sm px-5 py-1.5 rounded-xl transition-all">
            Simpan
          </button>
        </div>
      )}
    </div>
  );
}
