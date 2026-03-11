import {useState} from "react"
import api from "../services/api"
import {useNavigate} from "react-router-dom"

export default function Login(){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")

const navigate=useNavigate()

const login=async()=>{

const res = await api.post("/auth/login",{email,password})

localStorage.setItem("token",res.data.token)
localStorage.setItem("user",JSON.stringify(res.data.user))

if(res.data.user.role==="admin") navigate("/admin")

else navigate("/candidate")

}

return(

<div>

<h2>Login</h2>

<input onChange={e=>setEmail(e.target.value)} placeholder="Email"/>

<input onChange={e=>setPassword(e.target.value)} type="password"/>

<button onClick={login}>Login</button>

</div>

)

}