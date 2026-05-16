"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Mic, Palette, Lock, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Account & Security",
    nameShort: "Account",
    href: "/settings/account",
    icon: Shield,
    description: "Credentials, connected accounts",
  },
  {
    name: "AI & Recording",
    nameShort: "AI",
    href: "/settings/ai",
    icon: Mic,
    description: "Transcription and summary preferences",
  },
  {
    name: "Appearance",
    nameShort: "Look",
    href: "/settings/appearance",
    icon: Palette,
    description: "Theme, accent color, font size",
  },
  {
    name: "Privacy & Data",
    nameShort: "Privacy",
    href: "/settings/privacy",
    icon: Lock,
    description: "Visibility, retention, consent",
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account preferences and personalization.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="hidden md:block w-56 lg:w-64 shrink-0">
            <nav
              role="navigation"
              aria-label="Settings menu"
              className="sticky top-8 flex flex-col gap-1"
            >
              {navItems.map(({ name, href, icon: Icon, description }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150",
                      isActive
                        ? "bg-teal-500/10 text-teal-600 border border-teal-500/20"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-teal-500" : "group-hover:text-slate-900")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{name}</p>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />}
                  </Link>
                );
              })}

              <div className="h-px bg-slate-200 my-3" />

              <Link
                href="/profile/edit"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent transition-all duration-150"
              >
                <User className="w-4 h-4 shrink-0 group-hover:text-slate-900 transition-colors" />
                <span className="text-sm font-semibold">Edit Profile</span>
              </Link>
            </nav>
          </aside>

          {/* ── MOBILE TAB STRIP ── */}
          <div className="md:hidden -mx-4 px-4 mb-2 overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              {navItems.map(({ nameShort, href, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                      isActive
                        ? "bg-teal-500/10 text-teal-600 border border-teal-500/20"
                        : "bg-white text-slate-500 border border-slate-200 hover:text-slate-900"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {nameShort}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">
            <div className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 min-h-[600px] shadow-sm">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
