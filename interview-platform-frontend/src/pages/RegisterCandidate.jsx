import { useState } from "react";
import API from "../services/api";

function RegisterCandidate(){

 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const createCandidate = async () => {

  try{

   await API.post("/auth/register",{
    name,
    email,
    password,
    role:"candidate"
   });

   alert("Candidate account created");

   setName("");
   setEmail("");
   setPassword("");

  }catch(err){

   if(err.response){
    alert(err.response.data.message || "Error creating candidate");
   }else{
    alert("Server error");
   }

  }

 };

 return(

  <div style={{padding:"20px"}}>

   <h2>Create Candidate</h2>

   <input
   placeholder="Candidate Name"
   value={name}
   onChange={(e)=>setName(e.target.value)}
   />

   <br/><br/>

   <input
   placeholder="Candidate Email"
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

   <button onClick={createCandidate}>
    Create Candidate
   </button>

  </div>

 );
}

export default RegisterCandidate;