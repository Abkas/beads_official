import React, { useState } from "react";
import { login } from "../../api/UserApi";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (data.access_token) {
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900 text-center mb-8">Welcome Back</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
              required
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="w-4 h-4" />
            <label htmlFor="remember" className="ml-2 text-slate-900">
              Remember me
            </label>
          </div>

          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="text-amber-700 hover:text-amber-800 font-medium">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
