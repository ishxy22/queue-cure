import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) return setError("Password daalo pehle");
    setLoading(true);
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/login`, { password });
      localStorage.setItem("isReceptionist", "true");
      navigate("/receptionist");
    } catch (err) {
      setError("Wrong password. Try: clinic123");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
            <span className="text-white text-2xl font-bold">Q</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Staff Login</h1>
          <p className="text-gray-500 text-sm mt-1">Queue Cure — Receptionist Access</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
          <label className="text-xs text-gray-500 uppercase tracking-widest font-medium block mb-2">
            Clinic Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter password..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4"
          />
          {error && (
            <p className="text-red-400 text-xs mb-4">{error}</p>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-violet-500/25"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </div>

        <p className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 text-sm hover:text-gray-400 transition"
          >
            ← Back to home
          </button>
        </p>
        <p className="text-center text-gray-700 text-xs mt-4">
          Default password: clinic123
        </p>
      </div>
    </div>
  );
}