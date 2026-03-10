import {useState} from "react";
import API from "../services/api";

function Register(){

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const register=async()=>{

 await API.post("/admin/create-candidate",{
 name,
 email,
 password
 });

 alert("Candidate created");

}

return(

<div>

<h2>Create Candidate</h2>

<input placeholder="Name" onChange={(e)=>setName(e.target.value)}/>
<input placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
<input placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>

<button onClick={register}>
Create
</button>

</div>

)

}

export default Register;