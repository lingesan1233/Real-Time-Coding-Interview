import { Link, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Navbar(){

const navigate = useNavigate()
const location = useLocation()

const [role,setRole] = useState("")
const [email,setEmail] = useState("")

useEffect(()=>{

const user = JSON.parse(localStorage.getItem("user"))

if(user){
setRole(user.role)
setEmail(user.email)
}

},[])

const logout = ()=>{

localStorage.removeItem("token")
localStorage.removeItem("user")

navigate("/")

}

const isInterviewPage = location.pathname.includes("interview")

return(

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"12px 25px",
background:"#1f2937",
color:"white"
}}>

{/* Logo */}

<div style={{
fontWeight:"bold",
fontSize:"18px"
}}>
Real-Time Interview Platform
</div>


{/* Navigation */}

<div style={{
display:"flex",
gap:"20px",
alignItems:"center"
}}>

{role === "admin" && !isInterviewPage && (

<Link
to="/admin"
style={{color:"white",textDecoration:"none"}}
>
Admin Dashboard
</Link>

)}

{role === "candidate" && !isInterviewPage && (

<Link
to="/candidate"
style={{color:"white",textDecoration:"none"}}
>
Candidate Dashboard
</Link>

)}

{isInterviewPage && (

<span style={{color:"#facc15"}}>
Live Interview Session
</span>

)}

</div>


{/* User Info */}

<div style={{
display:"flex",
alignItems:"center",
gap:"15px"
}}>

<span style={{
fontSize:"14px",
color:"#9ca3af"
}}>
{email}
</span>

<button
onClick={logout}
style={{
background:"#ef4444",
border:"none",
padding:"6px 12px",
color:"white",
cursor:"pointer",
borderRadius:"5px"
}}
>
Logout
</button>

</div>

</div>

)

}