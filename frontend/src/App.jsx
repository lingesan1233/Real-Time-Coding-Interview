import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import InterviewRoom from "./pages/InterviewRoom";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/candidate" element={<CandidateDashboard />} />

        <Route path="/interview/:roomId" element={<InterviewRoom />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;