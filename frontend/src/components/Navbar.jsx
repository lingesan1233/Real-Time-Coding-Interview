import { Link } from "react-router-dom";

function Navbar() {

const logout = () => {
localStorage.removeItem("token");
window.location = "/";
};

return (

<div style={{
display:"flex",
justifyContent:"space-between",
background:"#222",
color:"#fff",
padding:"10px"
}}>

<h3>Interview Platform</h3>

<div>

<Link to="/admin" style={{marginRight:"10px",color:"#fff"}}>Admin</Link>

<Link to="/candidate" style={{marginRight:"10px",color:"#fff"}}>Candidate</Link>

<button onClick={logout}>
Logout
</button>

</div>

</div>

);

}

export default Navbar;