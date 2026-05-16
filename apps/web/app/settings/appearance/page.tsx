"use client";

import { useState } from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { SettingsGroup } from "@/components/ui/settings-group";
import { SettingsRow } from "@/components/ui/settings-row";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { UI_LOCALES } from "@/lib/i18n/dictionaries";

const THEMES = [
  { value: "DARK", label: "Dark", icon: Moon, description: "Dark mode always on" },
  { value: "LIGHT", label: "Light", icon: Sun, description: "Light mode always on" },
  { value: "SYSTEM", label: "System", icon: Monitor, description: "Follow OS setting" },
] as const;

const ACCENT_COLORS = [
  { value: "#00d4aa", label: "Teal (Default)", class: "bg-[#00d4aa]" },
  { value: "#6366f1", label: "Indigo", class: "bg-indigo-500" },
  { value: "#f59e0b", label: "Amber", class: "bg-amber-500" },
  { value: "#ec4899", label: "Pink", class: "bg-pink-500" },
  { value: "#22c55e", label: "Green", class: "bg-green-500" },
  { value: "#3b82f6", label: "Blue", class: "bg-blue-500" },
];

const FONT_SIZES = [
  { value: "SMALL", label: "Kecil", size: "text-sm", description: "14px" },
  { value: "MEDIUM", label: "Sedang", size: "text-base", description: "16px" },
  { value: "LARGE", label: "Besar", size: "text-lg", description: "18px" },
  { value: "XLARGE", label: "Sangat Besar", size: "text-xl", description: "20px (aksesibilitas)" },
];


export default function SettingsAppearancePage() {
  const [theme, setTheme] = useState<"DARK" | "LIGHT" | "SYSTEM">("DARK");
  const [accentColor, setAccentColor] = useState("#00d4aa");
  const [fontSize, setFontSize] = useState("MEDIUM");
  const [interfaceLang, setInterfaceLang] = useState("id");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  function mark() { setIsDirty(true); }

  const currentFontSize = FONT_SIZES.find((f) => f.value === fontSize);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Appearance</h2>
        <p className="text-slate-400 text-sm mt-1">Personalize the look and feel of your Fren-Edu workspace.</p>
      </div>

      {/* Tema */}
      <SettingsGroup title="Tema">
        <div className="py-4">
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map(({ value, label, icon: Icon, description }) => (
              <button
                key={value}
                onClick={() => { setTheme(value); mark(); }}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                  theme === value
                    ? "border-teal-500/60 bg-teal-500/10"
                    : "border-slate-700 bg-slate-800/40 hover:border-slate-600"
                )}
              >
                {theme === value && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
                <Icon className={cn("w-6 h-6", theme === value ? "text-teal-400" : "text-slate-400")} />
                <span className={cn("text-sm font-bold", theme === value ? "text-teal-400" : "text-white")}>{label}</span>
                <span className="text-[10px] text-slate-500 text-center">{description}</span>
              </button>
            ))}
          </div>
        </div>
      </SettingsGroup>

      {/* Aksen Warna */}
      <SettingsGroup title="Aksen Warna">
        <div className="py-4">
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map(({ value, label, class: cls }) => (
              <button
                key={value}
                onClick={() => { setAccentColor(value); mark(); }}
                title={label}
                className={cn(
                  "w-9 h-9 rounded-xl transition-all ring-offset-2 ring-offset-slate-900",
                  cls,
                  accentColor === value
                    ? "ring-2 ring-white scale-110"
                    : "hover:scale-110 opacity-70 hover:opacity-100"
                )}
              >
                {accentColor === value && (
                  <Check className="w-4 h-4 text-white mx-auto" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Warna aksen mempengaruhi tombol, indikator aktif, dan elemen interaktif.</p>
        </div>
      </SettingsGroup>

      {/* Ukuran Teks */}
      <SettingsGroup title="Ukuran Teks">
        <div className="py-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FONT_SIZES.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setFontSize(opt.value); mark(); }}
                className={cn(
                  "p-3 rounded-xl border-2 text-center transition-all",
                  fontSize === opt.value
                    ? "border-teal-500/60 bg-teal-500/10"
                    : "border-slate-700 bg-slate-800/40 hover:border-slate-600"
                )}
              >
                <span className={cn("font-bold block", opt.size, fontSize === opt.value ? "text-teal-400" : "text-white")}>Aa</span>
                <span className="text-xs text-slate-400 mt-1 block">{opt.label}</span>
                <span className="text-[10px] text-slate-600">{opt.description}</span>
              </button>
            ))}
          </div>
          {/* Live Preview */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 mt-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Preview</p>
            <p className={cn("text-white font-medium leading-relaxed", currentFontSize?.size)}>
              Ini contoh teks transkrip dengan ukuran ini. AI akan menghasilkan ringkasan yang mudah dibaca.
            </p>
          </div>
        </div>
      </SettingsGroup>

      {/* Antarmuka */}
      <SettingsGroup title="Antarmuka">
        <SettingsRow label="Bahasa Antarmuka" description="Bahasa tampilan Fren-Edu." htmlFor="iface_lang">
          <select
            id="iface_lang"
            value={interfaceLang}
            onChange={(e) => { setInterfaceLang(e.target.value); mark(); }}
            className="bg-slate-800/60 border border-slate-700 hover:border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition-all appearance-none"
          >
            {UI_LOCALES.map((l) => (
              <option key={l.value} value={l.value}>{l.flag} {l.label}</option>
            ))}
          </select>
        </SettingsRow>
        <SettingsRow label="Sidebar Dikecilkan" description="Tampilkan sidebar dalam mode ikon kecil secara default." htmlFor="sidebar_col">
          <Toggle id="sidebar_col" checked={sidebarCollapsed} onChange={(v) => { setSidebarCollapsed(v); mark(); }} aria-label="Sidebar collapsed" />
        </SettingsRow>
        <SettingsRow label="Kurangi Animasi" description="Nonaktifkan animasi dan transisi untuk kenyamanan visual." htmlFor="reduced_motion">
          <Toggle id="reduced_motion" checked={reducedMotion} onChange={(v) => { setReducedMotion(v); mark(); }} aria-label="Reduced motion" />
        </SettingsRow>
      </SettingsGroup>

      {/* Save Bar */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 shadow-2xl shadow-black/40 animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-sm text-slate-300 font-medium">Perubahan belum disimpan</p>
          <button onClick={() => setIsDirty(false)} className="text-sm text-slate-500 hover:text-white font-semibold transition-colors">Batalkan</button>
          <button onClick={() => setIsDirty(false)} className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-bold px-4 py-1.5 rounded-xl transition-all">Simpan</button>
        </div>
      )}
    </div>
  );
}
