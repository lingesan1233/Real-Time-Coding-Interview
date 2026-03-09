import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const navigate = useNavigate();

 const login = async () => {

  try{

   const res = await API.post("/auth/login",{
    email,
    password
   });

   localStorage.setItem("token",res.data.token);
   localStorage.setItem("role",res.data.role);

   if(res.data.role === "admin"){
    navigate("/admin");
   }else{
    navigate("/candidate");
   }

  }catch(err){

   if(err.response){
    alert(err.response.data.message);
   }else{
    alert("Server error");
   }

  }

 };

 return(

  <div style={{padding:"20px"}}>

   <h2>Login</h2>

   <input
   type="email"
   placeholder="Email"
   value={email}
   onChange={(e)=>setEmail(e.target.value)}
   />

   <br/><br/>

   <input
   type="password"
   placeholder="Password"
   value={password}
   onChange={(e)=>setPassword(e.target.value)}
   />

   <br/><br/>

   <button onClick={login}>
    Login
   </button>

  </div>

 );
}

export default Login;