import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 p-5 rounded-[24px] flex items-center justify-between group hover:border-teal-400/60 hover:shadow-md transition-all duration-300 shadow-sm",
        className,
      )}
    >
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500 group-hover:bg-teal-100 transition-colors">
        {icon}
      </div>
    </div>
  );
}
