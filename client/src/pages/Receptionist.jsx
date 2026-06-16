import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const socket = io(import.meta.env.VITE_SERVER_URL);

export default function Receptionist() {
  const [queue, setQueue] = useState({
    currentToken: 0,
    avgConsultTime: 10,
    isPaused: false,
    waitingPatients: [],
  });
  const [name, setName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [avgTime, setAvgTime] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);          // ✅ loading state

  useEffect(() => {
    socket.on("queue:updated", (data) => {
      setQueue(data);
      setAvgTime(data.avgConsultTime);
      setIsPaused(data.isPaused);
      setLoaded(true);                                   // ✅ mark as loaded
    });
    return () => socket.off("queue:updated");
  }, []);

  const addPatient = async () => {
    if (!name.trim()) return alert("Patient ka naam daalo!");
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/patients`, { name: name.trim() });
      setName("");
      setSuccessMsg("Patient added! ✅");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      alert("Error adding patient.");
    }
  };

  const callNext = async () => {
    if (queue.waitingPatients.length === 0) return alert("Queue empty hai!");
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/queue/call-next`);
    } catch (err) {
      alert("Error calling next token.");
    }
  };

  const updateAvgTime = async (val) => {
    const num = Number(val);
    setAvgTime(num);
    try {
      await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/queue/avg-time`, { avgConsultTime: num });
    } catch (err) {
      console.error("Avg time update failed");
    }
  };

  const resetQueue = async () => {
    if (!window.confirm("Sure ho? Saare patients delete ho jayenge!")) return;
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/queue/reset`);
    } catch (err) {
      alert("Reset failed.");
    }
  };

  const togglePause = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/queue/toggle-pause`);
    } catch (err) {
      alert("Pause/resume failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
      <div className="max-w-2xl mx-auto">

        {/* ✅ Loading spinner */}
        {!loaded && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-sm">Connecting to queue...</p>
          </div>
        )}

        {loaded && (
          <>
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Q</span>
                  </div>
                  <span className="text-gray-500 text-sm">Queue Cure</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Receptionist Dashboard</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-500 text-sm">Live — updates in real time</p>
                </div>
              </div>

              {/* ✅ Logout + Patient View buttons */}
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => { localStorage.removeItem("isReceptionist"); window.location.href = "/"; }}
                  className="text-xs text-gray-600 hover:text-red-400 transition border border-white/10 px-3 py-1.5 rounded-lg"
                >
                  Logout
                </button>

                <a
                  href="/waiting"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-violet-400 hover:text-violet-300 transition border border-violet-500/30 px-3 py-1.5 rounded-lg bg-violet-500/10"
                >
                  Patient View →
                </a>
              </div>
            </div>

            {/* Paused Banner */}
            {isPaused && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <span className="text-yellow-400">⏸</span>
                <p className="text-yellow-400 text-sm font-medium">Queue is paused — patients see a hold message</p>
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Now Serving</p>
                <p className="text-4xl font-bold text-violet-400">#{queue.currentToken}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Waiting</p>
                <p className="text-4xl font-bold text-blue-400">{queue.waitingPatients.length}</p>
              </div>
            </div>

            {/* Add Patient */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
              <p className="text-sm font-medium text-gray-400 mb-3">Add Patient</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPatient()}
                  placeholder="Patient ka naam..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  onClick={addPatient}
                  className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition"
                >
                  Add
                </button>
              </div>
              {successMsg && <p className="text-green-400 text-sm mt-2">{successMsg}</p>}
            </div>

            {/* Call Next + Avg Time */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col gap-2">
                <button
                  onClick={callNext}
                  disabled={queue.waitingPatients.length === 0 || isPaused}
                  className="bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl p-4 font-semibold text-lg hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                >
                  Call Next Token
                </button>
                <button
                  onClick={togglePause}
                  className={`rounded-xl p-3 font-medium text-sm transition border ${
                    isPaused
                      ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20"
                  }`}
                >
                  {isPaused ? "▶ Resume Queue" : "⏸ Pause Queue"}
                </button>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                  Avg Time (mins)
                  <span className="ml-1 text-violet-400 normal-case">(auto)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={avgTime}
                  onChange={(e) => updateAvgTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Waiting List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
              <p className="text-sm font-medium text-gray-400 mb-3">Waiting Patients</p>
              {queue.waitingPatients.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-6">Queue empty hai</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {queue.waitingPatients.map((p) => (
                    <div key={p._id} className="flex justify-between items-center py-3">
                      <div>
                        <span className="font-bold text-violet-400 mr-2">#{p.tokenNumber}</span>
                        <span className="text-gray-300 text-sm">{p.name}</span>
                      </div>
                      <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-lg">~{p.estimatedWait} min</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 flex flex-col items-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Patient Waiting Room QR</p>
              <div className="bg-white p-3 rounded-xl">
                <QRCodeSVG value={`${window.location.origin}/waiting`} size={110} />
              </div>
              <p className="text-xs text-gray-600 mt-3 text-center">Scan to track token on phone</p>
            </div>

            {/* Reset */}
            <button onClick={resetQueue} className="text-red-500/50 text-xs hover:text-red-400 transition">
              Reset Queue
            </button>
          </>
        )}

      </div>
    </div>
  );
}