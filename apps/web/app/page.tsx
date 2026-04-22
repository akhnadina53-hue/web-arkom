import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎓 Fren-Edu
          </h1>
          <p className="text-xl text-slate-300">
            Transform Voice into Knowledge with AI-Powered Learning
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Prototype Link */}
          <Link
            href="/record"
            className="p-8 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              📝 Prototype Demo
            </h2>
            <p className="text-slate-400 mb-4">
              Standalone recording & transcription (client-side only)
            </p>
            <span className="text-teal-400 font-semibold">Live →</span>
          </Link>

          {/* Documentation Link */}
          <a
            href="../prototype/README.md"
            className="p-8 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              📚 Documentation
            </h2>
            <p className="text-slate-400 mb-4">
              Learn about architecture, setup, and features
            </p>
            <span className="text-teal-400 font-semibold">Read →</span>
          </a>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-slate-700/50 bg-slate-800/30">
            <h3 className="text-lg font-semibold text-teal-400 mb-2">🎙️ Recording</h3>
            <p className="text-slate-400 text-sm">
              Capture audio directly from your microphone
            </p>
          </div>

          <div className="p-6 rounded-lg border border-slate-700/50 bg-slate-800/30">
            <h3 className="text-lg font-semibold text-teal-400 mb-2">📝 Transcription</h3>
            <p className="text-slate-400 text-sm">
              Auto-transcribe with Web Speech API or AI models
            </p>
          </div>

          <div className="p-6 rounded-lg border border-slate-700/50 bg-slate-800/30">
            <h3 className="text-lg font-semibold text-teal-400 mb-2">🧠 Summarization</h3>
            <p className="text-slate-400 text-sm">
              Generate key points and summaries automatically
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-400 text-sm">
            Built with Next.js 15 + FastAPI + AI Models
          </p>
        </div>
      </div>
    </div>
  );
}
