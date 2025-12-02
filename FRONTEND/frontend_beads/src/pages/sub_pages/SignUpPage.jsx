import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/UserApi";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!username || !email || !password || !firstname || !lastname) {
      toast.error("All fields except phone are required.");
      setLoading(false);
      return;
    }
    if (password.length < 5) {
      toast.error("Password must be at least 5 characters.");
      setLoading(false);
      return;
    }
    try {
      await signup({ username, email, password, firstname, lastname, phone });
      toast.success("Signup completed!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Signup failed. Please check your details.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900 text-center mb-8">Create Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
              required
            />
          </div>
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
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={e => setFirstname(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={e => setLastname(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Phone (optional)</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-amber-700 hover:text-amber-800 font-medium">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
