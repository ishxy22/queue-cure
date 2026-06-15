import { BrowserRouter, Routes, Route } from "react-router-dom";
import Receptionist from "./pages/Receptionist";
import WaitingRoom from "./pages/WaitingRoom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Receptionist />} />
        <Route path="/waiting" element={<WaitingRoom />} />
      </Routes>
    </BrowserRouter>
  );
}