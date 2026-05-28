"use client";

import { useState } from "react";
import { SettingsRow } from "@/components/ui/settings-row";
import { Toggle } from "@/components/ui/toggle";

interface ToggleRowProps {
  id?: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: ToggleRowProps) {
  // Track whether this toggle has ever been activated
  const [hasBeenActivated, setHasBeenActivated] = useState(checked);

  const handleChange = (newValue: boolean) => {
    if (newValue && !hasBeenActivated) {
      setHasBeenActivated(true);
      // First activation — particle burst will fire
      onChange(newValue);
      return;
    }
    onChange(newValue);
  };

  return (
    <SettingsRow label={label} description={description}>
      <Toggle
        id={id}
        checked={checked}
        onChange={handleChange}
        aria-label={label}
        disabled={disabled}
        isFirstActivation={!hasBeenActivated}
      />
    </SettingsRow>
  );
}
