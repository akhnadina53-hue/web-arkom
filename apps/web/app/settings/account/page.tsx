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
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Account & Security</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your login credentials and account security.</p>
      </div>

      {/* Informasi Akun */}
      <SettingsGroup title="Informasi Akun">
        <SettingsRow
          label="Email"
          description="Your primary login email. Contact support to change."
          htmlFor="email"
        >
          <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-400">
            <Mail className="w-4 h-4 text-slate-500" />
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
            className="bg-slate-800/60 border border-slate-700 hover:border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all w-48"
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Login & Keamanan */}
      <SettingsGroup title="Login & Keamanan">
        <SettingsRow
          label="Password"
          description="Change your account password."
        >
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            Change Password
          </button>
        </SettingsRow>

        <SettingsRow
          label="Google Account"
          description="Connected for sign-in via Google OAuth."
        >
          <div className="flex items-center gap-2 text-sm text-teal-400 font-semibold">
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
              <span className="flex items-center gap-1.5 text-teal-400 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Terverifikasi
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                <XCircle className="w-4 h-4" />
                Belum Diverifikasi
              </span>
            )}
            <button className="bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500/50 text-teal-400 text-sm font-semibold px-4 py-2 rounded-xl transition-all">
              <GraduationCap className="w-4 h-4 inline mr-1.5" />
              Verifikasi Sekarang
            </button>
          </div>
        </SettingsRow>
      </SettingsGroup>

      {/* Save Bar */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 shadow-2xl shadow-black/40 animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-sm text-slate-300 font-medium">You have unsaved changes</p>
          <button onClick={() => setIsDirty(false)} className="text-sm text-slate-500 hover:text-white font-semibold transition-colors">
            Discard
          </button>
          <button onClick={() => setIsDirty(false)} className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-bold px-4 py-1.5 rounded-xl transition-all">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
