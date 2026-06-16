import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const socket = io("http://localhost:5000");

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
  const [isPaused, setIsPaused] = useState(false);       // ✅ Feature 1

  useEffect(() => {
    socket.on("queue:updated", (data) => {
      setQueue(data);
      setAvgTime(data.avgConsultTime);
      setIsPaused(data.isPaused);                        // ✅ Feature 1
    });
    return () => socket.off("queue:updated");
  }, []);

  const addPatient = async () => {
    if (!name.trim()) return alert("Patient ka naam daalo!");
    try {
      await axios.post("http://localhost:5000/api/patients", { name: name.trim() });
      setName("");
      setSuccessMsg("Patient add ho gaya! ✅");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      alert("Error adding patient. Server chal raha hai?");
    }
  };

  const callNext = async () => {
    if (queue.waitingPatients.length === 0) {
      return alert("Queue empty hai! Pehle patients add karo.");
    }
    try {
      await axios.post("http://localhost:5000/api/queue/call-next");
    } catch (err) {
      alert("Error calling next token.");
    }
  };

  const updateAvgTime = async (val) => {
    const num = Number(val);
    setAvgTime(num);
    try {
      await axios.patch("http://localhost:5000/api/queue/avg-time", { avgConsultTime: num });
    } catch (err) {
      console.error("Avg time update failed");
    }
  };

  const resetQueue = async () => {
    if (!window.confirm("Sure ho? Saare patients delete ho jayenge!")) return;
    try {
      await axios.post("http://localhost:5000/api/queue/reset");
    } catch (err) {
      alert("Reset failed.");
    }
  };

  // ✅ Feature 1 — Pause / Resume
  const togglePause = async () => {
    try {
      await axios.post("http://localhost:5000/api/queue/toggle-pause");
    } catch (err) {
      alert("Pause/resume failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Receptionist Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Queue Cure — Live Queue Management</p>
        </div>

        {/* ✅ Feature 1 — Paused Banner */}
        {isPaused && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <span className="text-yellow-500 text-lg">⏸</span>
            <p className="text-yellow-700 text-sm font-medium">Queue is paused — patients are seeing a hold message</p>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Now Serving</p>
            <p className="text-3xl font-bold text-blue-600">#{queue.currentToken}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Waiting</p>
            <p className="text-3xl font-bold text-gray-800">{queue.waitingPatients.length}</p>
          </div>
        </div>

        {/* Add Patient */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <p className="text-sm font-medium text-gray-600 mb-3">Add Patient</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPatient()}
              placeholder="Patient ka naam..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={addPatient}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
          {successMsg && (
            <p className="text-green-600 text-sm mt-2">{successMsg}</p>
          )}
        </div>

        {/* Call Next + Avg Time */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* ✅ Feature 1 — Call Next + Pause in one column */}
          <div className="flex flex-col gap-2">
            <button
              onClick={callNext}
              disabled={queue.waitingPatients.length === 0 || isPaused}
              className="bg-blue-600 text-white rounded-xl p-4 font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Call Next Token
            </button>
            <button
              onClick={togglePause}
              className={`rounded-xl p-3 font-medium text-sm transition ${
                isPaused
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
            >
              {isPaused ? "▶ Resume Queue" : "⏸ Pause Queue"}
            </button>
          </div>

          {/* ✅ Feature 3 — Avg time with auto-updates label */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="text-xs text-gray-400 uppercase tracking-wide block mb-2">
              Avg Consult Time (mins)
              <span className="ml-1 text-blue-400 normal-case">(auto-updates)</span>
            </label>
            <input
              type="number"
              min="1"
              value={avgTime}
              onChange={(e) => updateAvgTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Waiting List */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <p className="text-sm font-medium text-gray-600 mb-3">Waiting Patients</p>
          {queue.waitingPatients.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Queue empty hai</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {queue.waitingPatients.map((p) => (
                <div key={p._id} className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium text-blue-600 mr-2">#{p.tokenNumber}</span>
                    <span className="text-gray-700 text-sm">{p.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">~{p.estimatedWait} min wait</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Feature 4 — QR Code */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col items-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Patient Waiting Room</p>
          <QRCodeSVG value={`${window.location.origin}/waiting`} size={120} />
          <p className="text-xs text-gray-400 mt-3 text-center">Scan to track your token on phone</p>
        </div>

        {/* Reset */}
        <button
          onClick={resetQueue}
          className="text-red-400 text-xs hover:text-red-600 transition"
        >
          Reset Queue
        </button>

      </div>
    </div>
  );
}