import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">Q</span>
          </div>
          <span className="text-gray-800 font-semibold text-lg">Queue Cure</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/waiting")}
            className="text-blue-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            Check Queue
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Staff Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-20 flex flex-col items-center text-center">
        <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          Live Queue Management
        </span>
        <h1 className="text-5xl font-bold text-gray-800 leading-tight mb-6 max-w-2xl">
          No more waiting in the dark 🏥
        </h1>
        <p className="text-gray-500 text-lg max-w-xl leading-relaxed mb-10">
          Queue Cure replaces paper tokens with a live digital queue. Patients know exactly when they'll be called. Receptionists manage everything from one screen.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/waiting")}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition shadow-md shadow-blue-100"
          >
            View Live Queue →
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-gray-700 px-6 py-3 rounded-xl font-medium border border-gray-200 hover:border-blue-300 transition"
          >
            Receptionist Login
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Add patient in 10 seconds</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Type a name, hit Add — token assigned instantly. No paperwork, no slips.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">🔴</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Live updates, zero refresh</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Both screens sync the moment "Call Next" is clicked. Powered by WebSockets.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-21">⏱️</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Real wait time estimates</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Wait time auto-calculated from real consultation data — never hardcoded.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-10">
        <p className="text-gray-300 text-sm">Built for India's neighbourhood clinics · Queue Cure '26</p>
      </div>

    </div>
  );
}