"use client";

import { SettingsRow } from "@/components/ui/settings-row";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectRowProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
}

export function SelectRow({
  label,
  description,
  value,
  onChange,
  options,
  disabled,
}: SelectRowProps) {
  return (
    <SettingsRow label={label} description={description}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="input-field text-sm py-1.5 px-3 w-auto min-w-[120px] cursor-pointer"
        style={{
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </SettingsRow>
  );
}
