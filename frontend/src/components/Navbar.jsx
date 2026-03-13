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

      <div style={styles.logo}>
        Interview Platform
      </div>

      <div style={styles.right}>

       {/*{user?.role === "admin" && (
          <Link to="/admin" style={styles.link}>
            Admin Dashboard
          </Link>
        )}

        {user?.role === "candidate" && (
          <Link to="/candidate" style={styles.link}>
            Candidate Dashboard
          </Link>
        )}*/}

        {user && (
          <button onClick={logout} style={styles.btn}>
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

const styles = {

  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "65px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    background: "#0f172a",
    color: "white",
    boxSizing: "border-box",
    zIndex: 999
  },

  logo: {
    fontSize: "20px",
    fontWeight: "700"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap"
  },

  link: {
    textDecoration: "none",
    color: "#e2e8f0",
    fontWeight: "500",
    fontSize: "14px"
  },

  btn: {
    padding: "8px 16px",
    background: "#6366f1",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontWeight: "500"
  }

};