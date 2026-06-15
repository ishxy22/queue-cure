import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function WaitingRoom() {
  const [queue, setQueue] = useState({
    currentToken: 0,
    avgConsultTime: 10,
    waitingPatients: [],
  });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    socket.on("queue:updated", (data) => {
      setQueue(data);
      // Pulse animation jab token call ho
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    });
    return () => socket.off("queue:updated");
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-start p-6">

      {/* Header */}
      <div className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-xl font-semibold text-blue-800">Queue Cure Clinic</h1>
        <p className="text-blue-400 text-sm">Live Queue Display</p>
      </div>

      {/* Now Serving — Big Card */}
      <div
        className={`w-full max-w-2xl bg-blue-600 text-white rounded-2xl p-8 mb-6 text-center transition-all duration-300 ${
          pulse ? "scale-105 shadow-2xl" : "scale-100 shadow-lg"
        }`}
      >
        <p className="text-blue-200 text-sm uppercase tracking-widest mb-2">Now Serving</p>
        <p className="text-7xl font-bold">#{queue.currentToken}</p>
        <p className="text-blue-200 text-sm mt-3">
          {queue.waitingPatients.length} patient{queue.waitingPatients.length !== 1 ? "s" : ""} waiting
        </p>
      </div>

      {/* Waiting List */}
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-blue-100 p-4">
        <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Waiting Queue
        </p>

        {queue.waitingPatients.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-300 text-4xl mb-3">🎉</p>
            <p className="text-gray-400 text-sm">Queue is empty — no patients waiting</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {queue.waitingPatients.map((p, idx) => (
              <div
                key={p._id}
                className={`flex justify-between items-center py-3 px-2 rounded-lg ${
                  idx === 0 ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold ${
                      idx === 0 ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    #{p.tokenNumber}
                  </span>
                  <span className={`text-sm ${idx === 0 ? "text-gray-800 font-medium" : "text-gray-500"}`}>
                    {p.name}
                  </span>
                  {idx === 0 && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      Next
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">~{p.estimatedWait} min</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-blue-300 text-xs mt-6">Updates live — no refresh needed</p>
    </div>
  );
}