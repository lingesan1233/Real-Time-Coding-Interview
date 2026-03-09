import { BrowserRouter,Routes,Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import RegisterCandidate from "./pages/RegisterCandidate";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import InterviewRoom from "./pages/InterviewRoom";

function App(){

 return(

  <BrowserRouter>

   <Navbar/>

   <Routes>

    <Route path="/" element={<Login/>}/>

    <Route
     path="/register-candidate"
     element={<RegisterCandidate/>}
    />

    <Route
     path="/admin"
     element={<AdminDashboard/>}
    />

    <Route
     path="/candidate"
     element={<CandidateDashboard/>}
    />

    <Route
     path="/room/:roomId"
     element={<InterviewRoom/>}
    />

   </Routes>

  </BrowserRouter>

 );

}

export default App;