import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Receptionist from "./pages/Receptionist";
import WaitingRoom from "./pages/WaitingRoom";

// Auth guard — only let in if logged in
function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("isReceptionist") === "true";
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/receptionist" element={
          <ProtectedRoute>
            <Receptionist />
          </ProtectedRoute>
        } />
        <Route path="/waiting" element={<WaitingRoom />} />
      </Routes>
    </BrowserRouter>
  );
}