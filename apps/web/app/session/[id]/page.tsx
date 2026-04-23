export default function SessionPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">📝 Session: {params.id}</h1>

        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-semibold text-white mb-3">📄 Transcript</h2>
            <p className="text-slate-300">Transcript will appear here after processing...</p>
          </div>

          <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-semibold text-white mb-3">💡 Summary</h2>
            <p className="text-slate-300">AI-generated summary will appear here...</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={`/session/${params.id}/qa`}
              className="p-4 rounded-lg bg-teal-500/20 border border-teal-500 hover:bg-teal-500/30 transition text-center"
            >
              <p className="text-teal-400 font-semibold">❓ Q&A Review</p>
            </a>
            <a
              href={`/session/${params.id}/audio`}
              className="p-4 rounded-lg bg-purple-500/20 border border-purple-500 hover:bg-purple-500/30 transition text-center"
            >
              <p className="text-purple-400 font-semibold">🔊 Regenerate Audio</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
