// Minimal recorder helper (placeholder)
export async function requestMic() {
  return await navigator.mediaDevices.getUserMedia({ audio: true });
}

export function createMediaRecorder(stream: MediaStream, onData: (blob: Blob) => void) {
  const mr = new MediaRecorder(stream as any);
  mr.ondataavailable = (e: BlobEvent) => onData(e.data);
  return mr;
}
