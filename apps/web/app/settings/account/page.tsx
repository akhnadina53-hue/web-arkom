"use client";

import { useState } from "react";
import { Mail, Lock, Globe, GraduationCap, CheckCircle2, XCircle } from "lucide-react";
import { SettingsGroup } from "@/components/ui/settings-group";
import { SettingsRow } from "@/components/ui/settings-row";
import { Toggle } from "@/components/ui/toggle";
import { SaveBar } from "@/components/ui/save-bar";

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
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your login credentials and account security.</p>
      </div>

      {/* Informasi Akun */}
      <SettingsGroup title="Informasi Akun">
        <SettingsRow
          label="Email"
          description="Your primary login email. Contact support to change."
          htmlFor="email"
        >
          <div className="flex items-center gap-2 bg-[rgba(167,215,197,0.10)] border border-[var(--border-default)] rounded-xl px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
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
            className="bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[#A7D7C5] focus:border-[#74B49B] focus:ring-2 focus:ring-[rgba(167,215,197,0.25)] rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all w-48"
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Login & Keamanan */}
      <SettingsGroup title="Login & Keamanan">
        <SettingsRow
          label="Password"
          description="Change your account password."
        >
          <button className="bg-[var(--bg-elevated)] hover:bg-[rgba(167,215,197,0.12)] border border-[var(--border-default)] hover:border-[#A7D7C5] text-sm font-semibold text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-sm">
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
              <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-sm font-semibold">
                <XCircle className="w-4 h-4" />
                Belum Diverifikasi
              </span>
            )}
            <button
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              style={{
                background: "rgba(167,215,197,0.15)",
                border: "1px solid var(--border-default)",
                color: "var(--text-brand)",
              }}
            >
              <GraduationCap className="w-4 h-4 inline mr-1.5" />
              Verifikasi Sekarang
            </button>
          </div>
        </SettingsRow>
      </SettingsGroup>

      <SaveBar
        visible={isDirty}
        onSave={() => setIsDirty(false)}
        onDiscard={() => setIsDirty(false)}
      />
    </div>
  );
}
