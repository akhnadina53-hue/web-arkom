"use client";

import { useRef, useState, useCallback } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BannerUploaderProps {
  currentUrl?: string;
  onUpload?: (file: File) => Promise<void>;
  onRemove?: () => void;
  height?: number;
}

export function BannerUploader({
  currentUrl,
  onUpload,
  onRemove,
  height = 192,
}: BannerUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      if (onUpload) {
        setIsUploading(true);
        try {
          await onUpload(file);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [onUpload],
  );

  const displayUrl = preview || currentUrl;

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ height }}
      onClick={() => inputRef.current?.click()}
    >
      <div
        className="absolute inset-0"
        style={{
          background: displayUrl
            ? `url(${displayUrl}) center/cover no-repeat`
            : "linear-gradient(135deg, var(--color-smurf-200), var(--color-smurf-400))",
        }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2">
        <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
          Change Banner
        </span>
      </div>
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
