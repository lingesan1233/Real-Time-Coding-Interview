import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Login(){

const navigate = useNavigate()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [loading,setLoading] = useState(false)
const [error,setError] = useState("")

const handleLogin = async (e) => {

e.preventDefault()

setLoading(true)
setError("")

try{

const res = await api.post("/auth/login",{
email,
password
})

const { token, user } = res.data

// save auth data
localStorage.setItem("token",token)
localStorage.setItem("user",JSON.stringify(user))

// redirect based on role
if(user.role === "admin"){
navigate("/admin")
}else{
navigate("/candidate")
}

}catch(err){

setError("Invalid email or password")

}

setLoading(false)

}

return(

<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#f3f4f6"
}}>

<div style={{
background:"white",
padding:"40px",
borderRadius:"8px",
width:"350px",
boxShadow:"0px 4px 12px rgba(0,0,0,0.1)"
}}>

<h2 style={{
textAlign:"center",
marginBottom:"25px"
}}>
Interview Platform Login
</h2>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
border:"1px solid #ccc",
borderRadius:"4px"
}}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
border:"1px solid #ccc",
borderRadius:"4px"
}}
/>

{error && (

<p style={{
color:"red",
marginBottom:"10px",
fontSize:"14px"
}}>
{error}
</p>

)}

<button
type="submit"
disabled={loading}
style={{
width:"100%",
padding:"10px",
background:"#2563eb",
color:"white",
border:"none",
borderRadius:"4px",
cursor:"pointer"
}}
>

{loading ? "Logging in..." : "Login"}

</button>

</form>

<div style={{
marginTop:"20px",
fontSize:"14px",
textAlign:"center",
color:"#6b7280"
}}>



</div>

</div>

</div>

)

}