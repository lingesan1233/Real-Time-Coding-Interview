import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login(){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")

const navigate=useNavigate()

const login=async()=>{

try{

const res = await api.post("/auth/login",{email,password})

localStorage.setItem("token",res.data.token)
localStorage.setItem("user",JSON.stringify(res.data.user))

if(res.data.user.role==="admin") navigate("/admin")
else navigate("/candidate")

}catch(err){
alert("Login Failed")
}

}

return(

<div style={styles.page}>

<div style={styles.leftPanel}>

<div style={styles.card}>

<h1 style={styles.title}>Sign In</h1>

<input
style={styles.input}
placeholder="Email or Username"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
style={styles.input}
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button style={styles.button} onClick={login}>
Sign In
</button>

</div>

</div>

<div style={styles.rightPanel}>

<h1 style={styles.brand}>Interview Platform</h1>
<p style={styles.tagline}>
Real-time coding interviews with video collaboration
</p>

</div>

</div>

)

}

const styles={

page:{
display:"flex",
height:"100vh",
width:"100vw"
},

leftPanel:{
width:"35%",
minWidth:"380px",
background:"#e5e7eb",
display:"flex",
alignItems:"center",
justifyContent:"center"
},

rightPanel:{
flex:1,
background:"linear-gradient(135deg,#0f172a,#1e293b)",
color:"white",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
padding:"40px"
},

brand:{
fontSize:"42px",
fontWeight:"700",
marginBottom:"10px"
},

tagline:{
fontSize:"16px",
opacity:"0.8"
},

card:{
background:"white",
padding:"40px",
borderRadius:"20px",
boxShadow:"0 10px 30px rgba(0,0,0,0.1)",
display:"flex",
flexDirection:"column",
gap:"18px",
width:"80%",
maxWidth:"360px"
},

title:{
fontSize:"34px",
fontWeight:"700",
color:"#1e293b"
},

input:{
padding:"14px",
borderRadius:"30px",
border:"1px solid #e2e8f0",
outline:"none"
},

button:{
marginTop:"10px",
padding:"14px",
borderRadius:"30px",
border:"none",
color:"white",
fontWeight:"600",
cursor:"pointer",
background:"linear-gradient(90deg,#ff512f,#dd2476)"
}

}