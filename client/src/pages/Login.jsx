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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100">
            <span className="text-white text-2xl font-bold">Q</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Staff Login</h1>
          <p className="text-gray-400 text-sm mt-1">Queue Cure — Receptionist Access</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="text-xs text-gray-400 uppercase tracking-wide font-medium block mb-2">
            Clinic Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter password..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4"
          />
          {error && (
            <p className="text-red-400 text-xs mb-4">{error}</p>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </div>

        {/* Back link */}
        <p className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 text-sm hover:text-gray-600 transition"
          >
            ← Back to home
          </button>
        </p>

        {/* Hint */}
        <p className="text-center text-gray-300 text-xs mt-6">
          Default password: clinic123
        </p>

      </div>
    </div>
  );
}