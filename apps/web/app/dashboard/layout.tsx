"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Mic,
  LayoutDashboard,
  CirclePlus,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store/uiStore";
import { FrenEduLogo } from "@/components/ui/FrenEduLogo";

const navItems = [
  { href: "/dashboard", label: "Library", icon: LayoutDashboard },
  { href: "/record", label: "New Session", icon: CirclePlus },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      {/* DESKTOP SIDEBAR (Hidden on Mobile)*/}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex fixed top-0 left-0 h-full z-40 flex-col border-r overflow-hidden shadow-sm"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* Floating Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 border-b shrink-0"
          style={{ borderColor: "var(--border-default)" }}
        >
          <FrenEduLogo size={36} showText={!sidebarCollapsed} />
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-6 px-2 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                  isActive
                    ? "font-semibold"
                    : "hover:bg-[var(--color-smurf-100)] border border-transparent",
                )}
                style={
                  isActive
                    ? {
                        background: "var(--color-smurf-100)",
                        border: "1px solid var(--border-brand)",
                        color: "var(--color-smurf-700)",
                      }
                    : {
                        color: "var(--text-secondary)",
                      }
                }
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive ? "" : "group-hover:text-[var(--text-primary)]",
                  )}
                  style={isActive ? { color: "var(--color-smurf-600)" } : {}}
                />
                <motion.span
                  animate={{
                    opacity: sidebarCollapsed ? 0 : 1,
                    width: sidebarCollapsed ? 0 : "auto",
                  }}
                  className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                >
                  {label}
                </motion.span>

                {isActive && (
                  <motion.div
                    layoutId="desktop-active-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "var(--color-smurf-400)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div
          className="px-2 pb-4 border-t pt-4 space-y-1"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
              sidebarCollapsed ? "justify-center" : "",
            )}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 overflow-hidden"
              style={{
                background: "var(--color-smurf-100)",
                borderColor: "var(--border-brand)",
              }}
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--color-smurf-600)" }}
                >
                  {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              )}
            </div>

            <motion.div
              animate={{
                opacity: sidebarCollapsed ? 0 : 1,
                width: sidebarCollapsed ? 0 : "auto",
              }}
              className="flex-1 overflow-hidden"
            >
              <p
                className="text-xs font-bold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {session?.user?.name ?? "User"}
              </p>
              <p
                className="text-[10px] truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {session?.user?.email ?? ""}
              </p>
            </motion.div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-all w-full group"
            style={{ color: "var(--text-secondary)" }}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:text-red-500 transition-colors" />
            <motion.span
              animate={{
                opacity: sidebarCollapsed ? 0 : 1,
                width: sidebarCollapsed ? 0 : "auto",
              }}
              className="text-sm font-semibold whitespace-nowrap overflow-hidden group-hover:text-red-500"
            >
              Sign Out
            </motion.span>
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-[72px] -right-3 w-6 h-6 border rounded-full flex items-center justify-center transition-colors z-50 shadow-sm"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </motion.aside>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex justify-center">
        <nav
          className="border px-4 py-3 rounded-full flex items-center justify-around gap-2 w-full max-w-sm"
          style={{
            background: "var(--bg-card-glass)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "var(--border-default)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all"
                style={{
                  color: isActive
                    ? "var(--color-smurf-600)"
                    : "var(--text-secondary)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-bg"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: "var(--color-smurf-100)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 mb-1 z-10 transition-transform",
                    isActive && "scale-110",
                  )}
                />
                <span className="text-[10px] font-semibold z-10">{label}</span>
              </Link>
            );
          })}

          <div
            className="w-[1px] h-8 mx-1"
            style={{ background: "var(--border-default)" }}
          />

          {/* Mobile Profile Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl hover:text-red-500 transition-all"
            style={{ color: "var(--text-secondary)" }}
          >
            <LogOut className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-semibold">Exit</span>
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <main
        className={cn(
          "flex-1 min-h-screen pt-10 px-4 sm:px-8 pb-32 md:pb-16 transition-all duration-300 ease-in-out w-full max-w-[100vw]",
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[240px]",
        )}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 mb-8">
          <FrenEduLogo size={32} showText={true} />
        </div>

        {children}
      </main>
    </div>
  );
}
