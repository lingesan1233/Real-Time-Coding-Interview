import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";

import AdminInterviewRoom from "./pages/AdminInterviewRoom";
import CandidateInterviewRoom from "./pages/CandidateInterviewRoom";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/candidate" element={<CandidateDashboard />} />

        {/* Admin meeting room */}
        <Route 
          path="/admin/interview/:roomId" 
          element={<AdminInterviewRoom />} 
        />

        {/* Candidate meeting room */}
        <Route 
          path="/candidate/interview/:roomId" 
          element={<CandidateInterviewRoom />} 
        />

      </Routes>

    </BrowserRouter>

  );

}