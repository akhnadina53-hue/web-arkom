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
    <div className="flex min-h-screen bg-[#f7f9fb] text-slate-900 font-sans">
      
      {/* DESKTOP SIDEBAR (Hidden on Mobile)*/}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex fixed top-0 left-0 h-full z-40 flex-col bg-white border-r border-slate-200 overflow-hidden shadow-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 shrink-0">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <motion.span
            animate={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : "auto" }}
            className="font-bold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden"
          >
            Fren-Edu
          </motion.span>
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
                    ? "bg-teal-500/10 text-teal-600"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive ? "text-teal-500" : "group-hover:text-slate-900"
                  )}
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
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="px-2 pb-4 border-t border-slate-800/60 pt-4 space-y-1">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
              sidebarCollapsed ? "justify-center" : ""
            )}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 overflow-hidden">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-teal-400">
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
              <p className="text-xs font-bold text-slate-900 truncate">
                {session?.user?.name ?? "User"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {session?.user?.email ?? ""}
              </p>
            </motion.div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all w-full group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:text-red-400 transition-colors" />
            <motion.span
              animate={{
                opacity: sidebarCollapsed ? 0 : 1,
                width: sidebarCollapsed ? 0 : "auto",
              }}
              className="text-sm font-semibold whitespace-nowrap overflow-hidden text-slate-500 group-hover:text-red-500"
            >
              Sign Out
            </motion.span>
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-[72px] -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors z-50 shadow-sm"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3 text-slate-500" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-slate-500" />
          )}
        </button>
      </motion.aside>


      {/* MOBILE BOTTOM NAV (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex justify-center">
        <nav className="bg-white backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-200/80 px-4 py-3 rounded-full flex items-center justify-around gap-2 w-full max-w-sm">
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
                  "relative flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all",
                  isActive ? "text-teal-600" : "text-slate-400 hover:text-slate-700"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-bg"
                    className="absolute inset-0 bg-teal-500/10 rounded-2xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 mb-1 z-10 transition-transform", isActive && "scale-110")} />
                <span className="text-[10px] font-semibold z-10">{label}</span>
              </Link>
            );
          })}
          
          <div className="w-[1px] h-8 bg-slate-200 mx-1" />
          
          {/* Mobile Profile / Sign Out menu trigger could go here, for now a simple sign out button */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl text-slate-400 hover:text-red-500 transition-all"
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
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[240px]"
        )}
      >
        {/* Mobile Header (Shows Logo on small screens since sidebar is hidden) */}
        <div className="md:hidden flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">Fren-Edu</span>
        </div>

        {children}
      </main>

    </div>
  );
}
