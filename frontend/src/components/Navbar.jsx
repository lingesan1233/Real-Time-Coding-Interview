import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={styles.nav}>

      <h2>Interview Platform</h2>

      <div>

        {user?.role === "admin" && (
          <Link to="/admin" style={styles.link}>
            Admin Dashboard
          </Link>
        )}

        {user?.role === "candidate" && (
          <Link to="/candidate" style={styles.link}>
            Candidate Dashboard
          </Link>
        )}

        <button onClick={logout} style={styles.btn}>
          Logout
        </button>

      </div>

    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    background: "#222",
    color: "white"
  },
  link: {
    marginRight: "20px",
    color: "white",
    textDecoration: "none"
  },
  btn: {
    padding: "6px 10px",
    cursor: "pointer"
  }
};