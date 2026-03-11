import { Link } from "react-router-dom";

export default function Navbar() {

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <div style={{padding:10,background:"#222",color:"#fff"}}>
      
      <Link to="/admin" style={{marginRight:20}}>Admin</Link>

      <Link to="/candidate" style={{marginRight:20}}>Candidate</Link>

      <button onClick={logout}>Logout</button>

    </div>
  );
}