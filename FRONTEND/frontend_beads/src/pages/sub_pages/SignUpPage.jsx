
export default function SignUpPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900 text-center mb-8">Join Beads Official</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          <span className="text-sm">Already have an account?</span>{" "}
          <button onClick={() => onNavigate("login")} className="text-amber-700 hover:text-amber-800 font-medium">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
