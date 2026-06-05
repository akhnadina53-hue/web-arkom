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

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-display font-extrabold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Settings
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage your account preferences and personalization.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* DESKTOP SIDEBAR */}
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
                        ? "font-semibold"
                        : "hover:bg-[var(--color-smurf-100)] border border-transparent",
                    )}
                    style={
                      isActive
                        ? {
                            background: "var(--color-smurf-100)",
                            color: "var(--color-smurf-700)",
                            border: "1px solid var(--border-brand)",
                          }
                        : {
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive
                          ? ""
                          : "group-hover:text-[var(--text-primary)]",
                      )}
                      style={
                        isActive ? { color: "var(--color-smurf-600)" } : {}
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{name}</p>
                    </div>
                    {isActive && (
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "var(--color-smurf-500)" }}
                      />
                    )}
                  </Link>
                );
              })}

              <div
                className="h-px my-3"
                style={{ background: "var(--border-default)" }}
              />

              <Link
                href="/profile/edit"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent transition-all duration-150 hover:bg-[var(--color-smurf-100)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <User className="w-4 h-4 shrink-0 transition-colors group-hover:text-[var(--text-primary)]" />
                <span className="text-sm font-semibold group-hover:text-[var(--text-primary)]">
                  Edit Profile
                </span>
              </Link>
            </nav>
          </aside>

          {/* MOBILE TAB STRIP */}
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
                        ? "border"
                        : "border hover:text-[var(--text-primary)]",
                    )}
                    style={
                      isActive
                        ? {
                            background: "var(--color-smurf-100)",
                            color: "var(--color-smurf-700)",
                            borderColor: "var(--border-brand)",
                          }
                        : {
                            background: "var(--bg-card)",
                            color: "var(--text-secondary)",
                            borderColor: "var(--border-default)",
                          }
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {nameShort}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            <div
              className="border rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 min-h-[600px] shadow-sm"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-default)",
              }}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
