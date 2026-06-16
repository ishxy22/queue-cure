import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL);

export default function WaitingRoom() {
  const [queue, setQueue] = useState({
    currentToken: 0,
    avgConsultTime: 10,
    waitingPatients: [],
  });
  const [pulse, setPulse] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [myToken, setMyToken] = useState("");
  const [myTokenInput, setMyTokenInput] = useState("");
  const [isCalled, setIsCalled] = useState(false);

  useEffect(() => {
    socket.on("queue:updated", (data) => {
      setQueue(data);
      setIsPaused(data.isPaused);
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);

      if (myToken && data.currentToken === Number(myToken)) {
        setIsCalled(true);
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.frequency.value = 880;
        oscillator.type = "sine";
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1.5);
      }
    });
    return () => socket.off("queue:updated");
  }, [myToken]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex flex-col items-center justify-start p-6">

      {/* Header */}
      <div className="w-full max-w-2xl mb-8 text-center pt-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">Q</span>
          </div>
          <h1 className="text-lg font-semibold text-white">Queue Cure Clinic</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-gray-600 text-sm">Live Queue Display</p>
        </div>
      </div>

      {/* Token Alert */}
      {isCalled ? (
        <div className="w-full max-w-2xl mb-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-2xl p-6 text-center">
          <p className="text-4xl mb-2">🔔</p>
          <p className="text-2xl font-bold text-green-400">Your Turn! Token #{myToken}</p>
          <p className="text-gray-400 text-sm mt-1">Please proceed to the doctor's cabin</p>
          <button
            onClick={() => { setIsCalled(false); setMyToken(""); setMyTokenInput(""); }}
            className="mt-4 bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-500/30 transition"
          >
            Dismiss
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Track your token</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={myTokenInput}
              onChange={(e) => setMyTokenInput(e.target.value)}
              placeholder="Enter your token number"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={() => setMyToken(myTokenInput)}
              className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
            >
              Track
            </button>
          </div>
          {myToken && (
            <p className="text-green-400 text-xs mt-2">✅ Tracking token #{myToken} — we'll alert you</p>
          )}
        </div>
      )}

      {/* Now Serving */}
      <div className={`w-full max-w-2xl rounded-2xl p-8 mb-5 text-center transition-all duration-300 bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/30 ${pulse ? "scale-105" : "scale-100"}`}>
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Now Serving</p>
        <p className="text-8xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          #{queue.currentToken}
        </p>
        <p className="text-gray-500 text-sm mt-3">
          {queue.waitingPatients.length} patient{queue.waitingPatients.length !== 1 ? "s" : ""} waiting
        </p>
      </div>

      {/* Waiting List */}
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-5">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Waiting Queue</p>
        {queue.waitingPatients.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-gray-600 text-sm">Queue is empty — no patients waiting</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {queue.waitingPatients.map((p, idx) => (
              <div key={p._id} className={`flex justify-between items-center py-3 px-2 rounded-lg ${idx === 0 ? "bg-violet-500/10" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${idx === 0 ? "text-violet-400" : "text-gray-600"}`}>
                    #{p.tokenNumber}
                  </span>
                  <span className={`text-sm ${idx === 0 ? "text-white font-medium" : "text-gray-500"}`}>
                    {p.name}
                  </span>
                  {idx === 0 && (
                    <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full">
                      Next
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-lg">~{p.estimatedWait} min</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paused */}
      {isPaused && (
        <div className="w-full max-w-2xl mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-yellow-400 font-medium">⏸ Queue is paused — please wait</p>
          <p className="text-yellow-600 text-xs mt-1">The receptionist will resume shortly</p>
        </div>
      )}

      <p className="text-gray-700 text-xs mt-6">Updates live — no refresh needed</p>
    </div>
  );
}