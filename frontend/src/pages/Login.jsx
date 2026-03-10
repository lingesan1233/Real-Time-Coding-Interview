import { useState } from "react";
import { loginUser } from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    try {

      const res = await loginUser({
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        window.location = "/admin";
      } else {
        window.location = "/candidate";
      }

    } catch (error) {

      alert("Invalid email or password");

    }

  };

  return (

    <div style={{ textAlign: "center", marginTop: "100px" }}>

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>
        Login
      </button>

    </div>

  );

}

export default Login;