import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";

import AdminInterviewRoom from "./pages/AdminInterviewRoom";
import CandidateInterviewRoom from "./pages/CandidateInterviewRoom";

function App() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>

      {user && <Navbar />}

      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Candidate Dashboard */}
        <Route path="/candidate" element={<CandidateDashboard />} />

        {/* Admin Interview Room */}
        <Route
          path="/admin-room/:roomId"
          element={<AdminInterviewRoom />}
        />

        {/* Candidate Interview Room */}
        <Route
          path="/candidate-room/:roomId"
          element={<CandidateInterviewRoom />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;