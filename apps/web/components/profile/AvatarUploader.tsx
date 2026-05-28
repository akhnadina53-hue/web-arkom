"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppReducedMotion } from "@/lib/hooks/useAppReducedMotion";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AvatarUploaderProps {
  currentUrl?: string;
  onUpload?: (file: File) => Promise<void>;
  onRemove?: () => void;
  size?: number;
  name?: string;
}

export function AvatarUploader({ currentUrl, onUpload, onRemove, size = 96, name = "User" }: AvatarUploaderProps) {
  const shouldReduceMotion = useAppReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    if (onUpload) {
      setIsUploading(true);
      try { await onUpload(file); } finally { setIsUploading(false); }
    }
  }, [onUpload]);

  const displayUrl = preview || currentUrl;

  return (
    <div className="flex items-center gap-4">
      <motion.div
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        className="relative rounded-full overflow-hidden cursor-pointer group"
        style={{ width: size, height: size, border: "3px solid var(--border-brand)", boxShadow: "var(--shadow-md)" }}
        onClick={() => inputRef.current?.click()}
      >
        {displayUrl ? (
          <img src={displayUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display font-bold text-xl"
            style={{ background: "linear-gradient(135deg, var(--color-smurf-300), var(--color-smurf-400))", color: "white" }}>
            {name[0]?.toUpperCase() ?? "U"}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>
      <div className="flex flex-col gap-2">
        <Button variant="secondary" className="text-xs px-3 py-1.5" onClick={() => inputRef.current?.click()}>
          <Upload className="w-3.5 h-3.5" /> Upload Photo
        </Button>
        {(currentUrl || preview) && onRemove && (
          <button onClick={() => { setPreview(null); onRemove(); }}
            className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Remove</button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </div>
  );
}
