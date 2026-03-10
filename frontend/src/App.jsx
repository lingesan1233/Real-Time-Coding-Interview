import {BrowserRouter,Routes,Route} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import InterviewRoom from "./pages/InterviewRoom";

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>}/>
<Route path="/admin" element={<AdminDashboard/>}/>
<Route path="/candidate" element={<CandidateDashboard/>}/>
<Route path="/room/:roomId" element={<InterviewRoom/>}/>

</Routes>

</BrowserRouter>

)

}

export default App