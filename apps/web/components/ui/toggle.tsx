"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

export function Toggle({ checked, onChange, disabled, id, "aria-label": ariaLabel }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked
          ? "bg-teal-500 border-teal-500"
          : "bg-slate-700 border-slate-600"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
