import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";

import AdminInterviewRoom from "./pages/AdminInterviewRoom";
import CandidateInterviewRoom from "./pages/CandidateInterviewRoom";

function Layout() {

  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const showNavbar = user && location.pathname !== "/";

  return (
    <>

      {showNavbar && <Navbar />}

      <div style={{ paddingTop: showNavbar ? "70px" : "0px" }}>

        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/candidate" element={<CandidateDashboard />} />

          <Route
            path="/admin-room/:roomId"
            element={<AdminInterviewRoom />}
          />

          <Route
            path="/candidate-room/:roomId"
            element={<CandidateInterviewRoom />}
          />

        </Routes>

      </div>

    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}