"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRecordingStore } from "@/lib/store/recordingStore";

interface ChunkUploaderProps {
  sessionId: string | null;
  onChunkUploaded?: (chunkIndex: number, total: number) => void;
  onError?: (error: Error) => void;
}

export function ChunkUploader({
  sessionId,
  onChunkUploaded,
  onError,
}: ChunkUploaderProps) {
  const chunks = useRecordingStore((s) => s.chunks);
  const uploadedIndexRef = useRef<Set<number>>(new Set());

  const uploadChunk = useCallback(
    async (chunk: Blob, index: number) => {
      if (!sessionId) return;
      if (uploadedIndexRef.current.has(index)) return;

      uploadedIndexRef.current.add(index);

      try {
        const formData = new FormData();
        formData.append("session_id", sessionId);
        formData.append("chunk_index", String(index));
        formData.append("total_chunks", String(chunks.length));
        formData.append("audio", chunk, `chunk-${index}.webm`);

        const res = await fetch("/api/upload/chunk", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.error?.message ?? `Upload failed (${res.status})`,
          );
        }

        onChunkUploaded?.(index, chunks.length);
      } catch (err) {
        uploadedIndexRef.current.delete(index);
        onError?.(
          err instanceof Error ? err : new Error("Unknown upload error"),
        );
      }
    },
    [sessionId, chunks.length, onChunkUploaded, onError],
  );

  useEffect(() => {
    chunks.forEach((chunk, index) => {
      if (!uploadedIndexRef.current.has(index)) {
        uploadChunk(chunk, index);
      }
    });
  }, [chunks, uploadChunk]);

  useEffect(() => {
    uploadedIndexRef.current = new Set();
  }, [sessionId]);

  return null;
}
