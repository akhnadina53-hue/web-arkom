export default async function QAPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          ❓ Q&A Session: {id}
        </h1>

        <div className="space-y-4">
          <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/50">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Question 1
            </h3>
            <p className="text-slate-300 mb-4">What is the main topic?</p>
            <input
              type="text"
              placeholder="Your answer..."
              className="w-full px-4 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-teal-400 focus:outline-none"
            />
            <button className="mt-3 px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600">
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
