export default async function AudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          🔊 Regenerate Audio: {id}
        </h1>

        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              Voice Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Select Voice
                </label>
                <select className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-teal-400 focus:outline-none">
                  <option>Female - Clear</option>
                  <option>Male - Deep</option>
                  <option>Neutral - Formal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Language Style
                </label>
                <select className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-teal-400 focus:outline-none">
                  <option>Formal (Bahasa Baku)</option>
                  <option>Casual (Sehari-hari)</option>
                  <option>Academic (Ilmiah)</option>
                </select>
              </div>

              <button className="w-full px-6 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition">
                🎵 Generate Audio
              </button>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
            <p className="text-slate-400">
              Generated audio will appear here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
