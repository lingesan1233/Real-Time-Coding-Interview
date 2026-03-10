import { useState,useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminDashboard(){

const[name,setName]=useState("");
const[email,setEmail]=useState("");
const[password,setPassword]=useState("");

const[candidateId,setCandidateId]=useState("");
const[candidateName,setCandidateName]=useState("");
const[task,setTask]=useState("");

const[interviews,setInterviews]=useState([]);

useEffect(()=>{
loadInterviews();
},[]);

const loadInterviews = async()=>{

const res = await axios.get(
"http://localhost:5000/api/admin/interviews"
);

setInterviews(res.data);

};

const createCandidate = async()=>{

await axios.post(
"http://localhost:5000/api/admin/createCandidate",
{name,email,password}
);

alert("Candidate created");

};

const createInterview = async()=>{

await axios.post(
"http://localhost:5000/api/admin/createInterview",
{
candidateId,
candidateName,
task
}
);

alert("Interview created");

loadInterviews();

};

return(

<div>

<Navbar/>

<h2>Admin Dashboard</h2>

<h3>Create Candidate</h3>

<input placeholder="Name"
onChange={e=>setName(e.target.value)}
/>

<input placeholder="Email"
onChange={e=>setEmail(e.target.value)}
/>

<input placeholder="Password"
onChange={e=>setPassword(e.target.value)}
/>

<button onClick={createCandidate}>
Create Candidate
</button>


<h3>Create Interview</h3>

<input placeholder="Candidate Id"
onChange={e=>setCandidateId(e.target.value)}
/>

<input placeholder="Candidate Name"
onChange={e=>setCandidateName(e.target.value)}
/>

<textarea
placeholder="Coding Task"
onChange={e=>setTask(e.target.value)}
/>

<button onClick={createInterview}>
Create Interview
</button>


<h3>Interview List</h3>

{interviews.map(i=>(
<div key={i._id} style={{border:"1px solid gray",margin:"10px",padding:"10px"}}>

<p>Candidate : {i.candidateName}</p>

<p>Task : {i.task}</p>

<button
onClick={()=>window.location=`/room/${i.roomId}`}
>

Join Interview

</button>

</div>
))}

</div>

);

}

export default AdminDashboard;