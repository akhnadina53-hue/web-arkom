import React from 'react';

export default function RecorderButton({ onClick, isRecording }: { onClick: () => void; isRecording: boolean }) {
  return (
    <button onClick={onClick} style={{ padding: 12, borderRadius: 8 }}>
      {isRecording ? '⛔ Stop Rekam' : '🎤 Mulai Rekam'}
    </button>
  );
}
