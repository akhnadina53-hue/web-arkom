export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
        <p className="text-slate-400">Sign in to your account</p>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:border-teal-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:border-teal-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-slate-400">
        Don't have an account?{' '}
        <a href="/register" className="text-teal-400 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
