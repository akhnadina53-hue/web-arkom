"use client";

interface FontSizePreviewProps {
  value: number;
  onChange: (value: number) => void;
}

const FONT_SIZES = [
  { value: 85, label: "Small" },
  { value: 100, label: "Default" },
  { value: 115, label: "Large" },
  { value: 130, label: "Extra Large" },
];

export function FontSizePreview({ value, onChange }: FontSizePreviewProps) {
  return (
    <div className="space-y-4">
      {/* Slider */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          A
        </span>
        <input
          type="range"
          min={85}
          max={130}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-smurf-300) 0%, var(--color-smurf-300) ${((value - 85) / 45) * 100}%, var(--border-default) ${((value - 85) / 45) * 100}%, var(--border-default) 100%)`,
          }}
          aria-label="Font size"
        />
        <span
          className="text-base font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          A
        </span>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-2">
        {FONT_SIZES.map((size) => (
          <button
            key={size.value}
            onClick={() => onChange(size.value)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background:
                value === size.value ? "var(--color-smurf-100)" : "transparent",
              color:
                value === size.value
                  ? "var(--color-smurf-700)"
                  : "var(--text-secondary)",
              border:
                value === size.value
                  ? "1px solid var(--border-brand)"
                  : "1px solid transparent",
            }}
          >
            {size.label}
          </button>
        ))}
      </div>

      {/* Live preview */}
      <div
        className="p-4 rounded-xl"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          fontSize: `${(14 * value) / 100}px`,
          color: "var(--text-primary)",
        }}
      >
        <p className="font-medium mb-1">Preview text</p>
        <p style={{ color: "var(--text-secondary)" }}>
          This is how your content will look at {value}% size.
        </p>
      </div>
    </div>
  );
}
