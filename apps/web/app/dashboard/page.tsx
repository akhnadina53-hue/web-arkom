export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">📚 My Recordings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition cursor-pointer">
            <h3 className="text-lg font-semibold text-white mb-2">No recordings yet</h3>
            <p className="text-slate-400 text-sm">Start recording a new session to see it here</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <a
            href="/record"
            className="px-6 py-3 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
          >
            🎙️ New Recording
          </a>
        </div>
      </div>
    </div>
  );
}
