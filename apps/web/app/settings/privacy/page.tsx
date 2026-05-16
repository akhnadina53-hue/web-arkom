"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, UserX } from "lucide-react";
import { SettingsGroup } from "@/components/ui/settings-group";
import { SettingsRow } from "@/components/ui/settings-row";
import { Toggle } from "@/components/ui/toggle";

const RETENTION_OPTIONS = [
  { value: 1, label: "Hapus setelah 1 hari" },
  { value: 7, label: "Hapus setelah 7 hari" },
  { value: 30, label: "Hapus setelah 30 hari" },
  { value: 0, label: "Simpan selamanya" },
];

export default function SettingsPrivacyPage() {
  const [profilePublic, setProfilePublic] = useState(true);
  const [showInstitution, setShowInstitution] = useState(true);
  const [showInterests, setShowInterests] = useState(true);
  const [retentionDays, setRetentionDays] = useState(1);
  const [aiDataConsent, setAiDataConsent] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  function mark() { setIsDirty(true); }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Privacy & Data</h2>
        <p className="text-slate-400 text-sm mt-1">Control your visibility, data retention, and AI usage consent.</p>
      </div>

      {/* Visibilitas Profil */}
      <SettingsGroup title="Visibilitas Profil">
        <SettingsRow label="Profil Publik" description="Izinkan siapa saja melihat profil kamu, termasuk pengguna yang belum login." htmlFor="profile_public">
          <Toggle id="profile_public" checked={profilePublic} onChange={(v) => { setProfilePublic(v); mark(); }} aria-label="Profile public" />
        </SettingsRow>
        <SettingsRow label="Tampilkan Institusi" description="Tampilkan nama universitas dan jurusan di profil publik." htmlFor="show_institution">
          <Toggle id="show_institution" checked={showInstitution} onChange={(v) => { setShowInstitution(v); mark(); }} aria-label="Show institution" disabled={!profilePublic} />
        </SettingsRow>
        <SettingsRow label="Tampilkan Minat" description="Tampilkan tag minat di profil publik." htmlFor="show_interests">
          <Toggle id="show_interests" checked={showInterests} onChange={(v) => { setShowInterests(v); mark(); }} aria-label="Show interests" disabled={!profilePublic} />
        </SettingsRow>
      </SettingsGroup>

      {/* Retensi Data */}
      <SettingsGroup title="Retensi Data Rekaman">
        <SettingsRow
          label="Hapus Audio Otomatis"
          description="File audio dikompresi dan dihapus setelah periode ini. Transkrip dan ringkasan tetap tersimpan."
          htmlFor="retention"
        >
          <select
            id="retention"
            value={retentionDays}
            onChange={(e) => { setRetentionDays(Number(e.target.value)); mark(); }}
            className="bg-slate-800/60 border border-slate-700 hover:border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition-all appearance-none"
          >
            {RETENTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </SettingsRow>
      </SettingsGroup>

      {/* AI & Data */}
      <SettingsGroup title="AI & Data">
        <SettingsRow
          label="Izinkan Data untuk Pelatihan AI"
          description="Rekaman dan transkrip anonim kamu mungkin digunakan untuk meningkatkan model AI Fren-Edu. Data pribadimu tidak akan pernah dijual atau dibagikan ke pihak ketiga."
          htmlFor="ai_consent"
        >
          <Toggle id="ai_consent" checked={aiDataConsent} onChange={(v) => { setAiDataConsent(v); mark(); }} aria-label="AI data consent" />
        </SettingsRow>
      </SettingsGroup>

      {/* Danger Zone */}
      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">Danger Zone</h3>
        </div>
        <div className="border-2 border-red-500/20 rounded-2xl overflow-hidden bg-red-950/10 divide-y divide-red-500/10">
          {/* Clear Data */}
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Hapus Semua Data</p>
              <p className="text-xs text-slate-400 mt-0.5">Hapus semua sesi, transkrip, dan audio. Akun kamu tetap aktif.</p>
            </div>
            <button
              onClick={() => setShowDeleteDataModal(true)}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 text-sm font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Data
            </button>
          </div>
          {/* Delete Account */}
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Hapus Akun</p>
              <p className="text-xs text-slate-400 mt-0.5">Akun kamu akan dijadwalkan untuk dihapus permanen dalam 30 hari. Tidak dapat dibatalkan setelah masa tenggang.</p>
            </div>
            <button
              onClick={() => setShowDeleteAccountModal(true)}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 text-sm font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              <UserX className="w-4 h-4" />
              Hapus Akun
            </button>
          </div>
        </div>
      </div>

      {/* Save Bar */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 shadow-2xl shadow-black/40 animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-sm text-slate-300 font-medium">Perubahan belum disimpan</p>
          <button onClick={() => setIsDirty(false)} className="text-sm text-slate-500 hover:text-white font-semibold transition-colors">Batalkan</button>
          <button onClick={() => setIsDirty(false)} className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-bold px-4 py-1.5 rounded-xl transition-all">Simpan</button>
        </div>
      )}

      {/* Delete Data Confirmation Modal */}
      {showDeleteDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Hapus Semua Data?</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">Tindakan ini akan menghapus semua sesi, transkrip, dan file audio. Ketik <strong className="text-white">DELETE MY DATA</strong> untuk mengkonfirmasi.</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE MY DATA"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteDataModal(false); setConfirmText(""); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all">Batal</button>
              <button
                disabled={confirmText !== "DELETE MY DATA"}
                className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-xl transition-all"
                onClick={() => { setShowDeleteDataModal(false); setConfirmText(""); }}
              >
                Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Hapus Akun?</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">Akun kamu akan <strong className="text-red-400">dihapus permanen</strong> dalam 30 hari. Ketik <strong className="text-white">DELETE MY ACCOUNT</strong> untuk mengkonfirmasi.</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteAccountModal(false); setConfirmText(""); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all">Batal</button>
              <button
                disabled={confirmText !== "DELETE MY ACCOUNT"}
                className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-xl transition-all"
                onClick={() => { setShowDeleteAccountModal(false); setConfirmText(""); }}
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
