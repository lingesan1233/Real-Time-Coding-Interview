import { Link } from "react-router-dom";

function Navbar() {

 const role = localStorage.getItem("role");

 return (
  <nav>

   <h2>Interview Platform</h2>

   {role === "admin" && (
    <>
     <Link to="/admin">Dashboard</Link>
     <Link to="/register-candidate">Create Candidate</Link>
    </>
   )}

   {role === "candidate" && (
    <Link to="/candidate">Dashboard</Link>
   )}

  </nav>
 );
}

export default Navbar;