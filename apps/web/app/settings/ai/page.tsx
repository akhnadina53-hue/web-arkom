"use client";

import { useState } from "react";
import { SettingsGroup } from "@/components/ui/settings-group";
import { SettingsRow } from "@/components/ui/settings-row";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { ALL_LANGUAGES, groupByRegion, findLanguage } from "@/lib/i18n/languages";
import { SaveBar } from "@/components/ui/save-bar";

const WHISPER_OPTIONS = [
  { value: "FAST", label: "Cepat", sublabel: "Whisper Small", description: "Lebih cepat, akurasi standar. Cocok untuk kuliah ringan." },
  { value: "BALANCED", label: "Seimbang", sublabel: "Whisper Medium", description: "Default. Keseimbangan terbaik antara kecepatan dan akurasi." },
  { value: "ACCURATE", label: "Akurat", sublabel: "Whisper Large v3", description: "Paling akurat, sedikit lebih lambat. Ideal untuk presentasi padat." },
];

const AUDIO_QUALITY = [
  { value: "LOW", label: "Rendah (64kbps)" },
  { value: "MEDIUM", label: "Sedang (128kbps)" },
  { value: "HIGH", label: "Tinggi (192kbps)" },
];

const CHUNK_INTERVALS = [
  { value: 15, label: "15 detik" },
  { value: 30, label: "30 detik" },
  { value: 60, label: "60 detik" },
];

const SUMMARY_LENGTHS = [
  { value: "SHORT", label: "Singkat (3 poin)" },
  { value: "MEDIUM", label: "Sedang (5–7 poin)" },
  { value: "DETAILED", label: "Lengkap (terstruktur)" },
];

const SUMMARY_FORMATS = [
  { value: "BULLET", label: "Poin-poin (bullet)" },
  { value: "PARAGRAPH", label: "Paragraf" },
  { value: "STRUCTURED", label: "Terstruktur (judul + poin)" },
];

export default function SettingsAIPage() {
  const [whisperQuality, setWhisperQuality] = useState("BALANCED");
  const [language, setLanguage] = useState("auto");
  const groupedLanguages = groupByRegion(ALL_LANGUAGES);
  const selectedLang = findLanguage(language);

  const [audioQuality, setAudioQuality] = useState("HIGH");
  const [chunkInterval, setChunkInterval] = useState(30);
  const [noiseCancellation, setNoiseCancellation] = useState(true);
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [summaryLength, setSummaryLength] = useState("MEDIUM");
  const [summaryFormat, setSummaryFormat] = useState("BULLET");
  const [isDirty, setIsDirty] = useState(false);

  function mark() { setIsDirty(true); }

  const selectClass = "bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[#A7D7C5] focus:border-[#74B49B] focus:ring-2 focus:ring-[rgba(167,215,197,0.25)] rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none transition-all appearance-none cursor-pointer";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight" style={{background:"linear-gradient(135deg,#74B49B,#A7D7C5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI &amp; Recording</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Customize how Fren-Edu records, transcribes, and summarizes your sessions.</p>
      </div>

      {/* Transkripsi */}
      <SettingsGroup title="Transkripsi">
        <SettingsRow
          label="Bahasa Transkripsi"
          description="Pilih bahasa rekaman kamu, atau biarkan AI mendeteksi secara otomatis."
          htmlFor="lang"
        >
          <div className="flex items-center gap-2">
            {selectedLang && (
              <span className="text-lg" aria-hidden="true">{selectedLang.flag}</span>
            )}
            <select
              id="lang"
              value={language}
              onChange={(e) => { setLanguage(e.target.value); mark(); }}
              className={selectClass}
            >
              {Object.entries(groupedLanguages).map(([region, langs]) => (
                <optgroup key={region} label={region}>
                  {langs.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.flag} {l.label} — {l.native}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </SettingsRow>

        <SettingsRow label="Kualitas Transkripsi" description="Pilih model Whisper yang sesuai dengan kebutuhanmu.">
          <div className="w-full sm:w-auto" />
        </SettingsRow>
        {/* Whisper radio cards — full-width below the row */}
        <div className="pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {WHISPER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setWhisperQuality(opt.value); mark(); }}
                className="text-left p-4 rounded-2xl transition-all"
                style={whisperQuality === opt.value ? {
                  background: "rgba(167,215,197,0.18)",
                  border: "2px solid rgba(116,180,155,0.60)",
                } : {
                  background: "var(--bg-elevated)",
                  border: "2px solid var(--border-default)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={whisperQuality === opt.value ? {color:"var(--text-brand)"} : {color:"var(--text-primary)"}}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md" style={{background:"rgba(167,215,197,0.15)",color:"#74B49B"}}>{opt.sublabel}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{opt.description}</p>
              </button>
            ))}
          </div>
        </div>
      </SettingsGroup>

      {/* Rekaman */}
      <SettingsGroup title="Rekaman">
        <SettingsRow label="Kualitas Audio" description="Kualitas tinggi menghasilkan transkripsi lebih akurat." htmlFor="audio_quality">
          <select id="audio_quality" value={audioQuality} onChange={(e) => { setAudioQuality(e.target.value); mark(); }} className={selectClass}>
            {AUDIO_QUALITY.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </SettingsRow>
        <SettingsRow label="Interval Pemrosesan" description="Seberapa sering audio dikirim ke server untuk ditranskripsi." htmlFor="chunk">
          <select id="chunk" value={chunkInterval} onChange={(e) => { setChunkInterval(Number(e.target.value)); mark(); }} className={selectClass}>
            {CHUNK_INTERVALS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </SettingsRow>
        <SettingsRow label="Peredam Kebisingan" description="Kurangi suara latar sebelum transkripsi." htmlFor="noise">
          <Toggle id="noise" checked={noiseCancellation} onChange={(v) => { setNoiseCancellation(v); mark(); }} aria-label="Noise cancellation" />
        </SettingsRow>
      </SettingsGroup>

      {/* Ringkasan AI */}
      <SettingsGroup title="Ringkasan AI">
        <SettingsRow label="Ringkasan Otomatis" description="Buat ringkasan secara otomatis saat rekaman selesai." htmlFor="auto_sum">
          <Toggle id="auto_sum" checked={autoSummarize} onChange={(v) => { setAutoSummarize(v); mark(); }} aria-label="Auto summarize" />
        </SettingsRow>
        <SettingsRow label="Panjang Ringkasan" description="Seberapa detail ringkasan yang dihasilkan." htmlFor="sum_len">
          <select id="sum_len" value={summaryLength} onChange={(e) => { setSummaryLength(e.target.value); mark(); }} className={selectClass} disabled={!autoSummarize}>
            {SUMMARY_LENGTHS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </SettingsRow>
        <SettingsRow label="Format Ringkasan" description="Pilih gaya penulisan ringkasan favoritmu." htmlFor="sum_fmt">
          <select id="sum_fmt" value={summaryFormat} onChange={(e) => { setSummaryFormat(e.target.value); mark(); }} className={selectClass} disabled={!autoSummarize}>
            {SUMMARY_FORMATS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
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
