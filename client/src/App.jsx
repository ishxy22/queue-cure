import { BrowserRouter, Routes, Route } from "react-router-dom";
import Receptionist from "./pages/Receptionist";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Receptionist />} />
        {/* Day 4 mein WaitingRoom add karenge */}
      </Routes>
    </BrowserRouter>
  );
}