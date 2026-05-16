import React from "react";

interface SettingsGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsGroup({ title, description, children, className }: SettingsGroupProps) {
  return (
    <section className={`mb-8 ${className ?? ""}`}>
      <div className="mb-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
        {React.Children.map(children, (child) => (
          <div className="px-5">{child}</div>
        ))}
      </div>
    </section>
  );
}
