import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 max-w-6xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">Q</span>
          </div>
          <span className="font-semibold text-lg">Queue Cure</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/waiting")}
            className="text-gray-400 text-sm font-medium px-4 py-2 rounded-lg hover:text-white hover:bg-white/5 transition"
          >
            Check Queue
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Staff Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 pt-24 pb-20 flex flex-col items-center text-center">
        <span className="bg-violet-500/10 text-violet-400 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-widest uppercase border border-violet-500/20">
          Live Queue Management
        </span>
        <h1 className="text-6xl font-bold leading-tight mb-6 max-w-3xl">
          No more waiting{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            in the dark
          </span>{" "}
          🏥
        </h1>
        <p className="text-gray-400 text-lg max-w-xl leading-relaxed mb-10">
          Queue Cure replaces paper tokens with a live digital queue. Patients know exactly when they'll be called. Receptionists manage everything from one screen.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/waiting")}
            className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-violet-500/25"
          >
            View Live Queue →
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-white/5 text-gray-300 px-6 py-3 rounded-xl font-medium border border-white/10 hover:bg-white/10 transition"
          >
            Receptionist Login
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-6xl mx-auto px-8 mb-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 grid grid-cols-3 divide-x divide-white/10">
          <div className="text-center px-6">
            <p className="text-3xl font-bold text-violet-400">76%</p>
            <p className="text-gray-500 text-sm mt-1">of India's clinics use paper tokens</p>
          </div>
          <div className="text-center px-6">
            <p className="text-3xl font-bold text-blue-400">&lt;1s</p>
            <p className="text-gray-500 text-sm mt-1">live sync time via WebSockets</p>
          </div>
          <div className="text-center px-6">
            <p className="text-3xl font-bold text-teal-400">10s</p>
            <p className="text-gray-500 text-sm mt-1">to add a patient and assign token</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 rounded-2xl p-6">
            <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Add patient in 10 seconds</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Type a name, hit Add — token assigned instantly. No paperwork, no slips.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">🔴</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Live updates, zero refresh</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Both screens sync the moment "Call Next" is clicked. Powered by WebSockets.
            </p>
          </div>
          <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 rounded-2xl p-6">
            <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">⏱️</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Real wait time estimates</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Wait time auto-calculated from real consultation data — never hardcoded.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-10 border-t border-white/5 pt-8">
        <p className="text-gray-600 text-sm">Built for India's neighbourhood clinics · Queue Cure '26</p>
      </div>

    </div>
  );
}