import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login(){

  const nav = useNavigate();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const login = async ()=>{

    const res = await API.post("/auth/login",{
      email,
      password
    });

    localStorage.setItem("token",res.data.token);
    localStorage.setItem("role",res.data.user.role);

    if(res.data.user.role==="admin")
      nav("/admin");
    else
      nav("/candidate");
  };

  return(

    <div style={{padding:50}}>

      <h2>Login</h2>

      <input
        placeholder="email"
        onChange={e=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="password"
        type="password"
        onChange={e=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={login}>
        Login
      </button>

    </div>

  )

}