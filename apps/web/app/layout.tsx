import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fren-Edu - VoiceScribe AI',
  description: 'Transform Voice into Knowledge with AI-Powered Learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark bg-slate-900 min-h-screen selection:bg-teal-500/30">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
