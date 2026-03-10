import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {

const navigate = useNavigate();

const [candidates,setCandidates] = useState([]);
const [interviews,setInterviews] = useState([]);

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const [task,setTask] = useState("");
const [candidateId,setCandidateId] = useState("");

useEffect(()=>{
 loadCandidates();
 loadInterviews();
},[]);


// Load candidates
const loadCandidates = async () => {

 try{
 const res = await API.get("/admin/candidates");
 setCandidates(res.data);
 }catch(err){
 console.log(err);
 }

};


// Load interviews
const loadInterviews = async () => {

 try{
 const res = await API.get("/interview/all");
 setInterviews(res.data);
 }catch(err){
 console.log(err);
 }

};


// Create candidate
const createCandidate = async () => {

 try{

 await API.post("/admin/create-candidate",{
 name,
 email,
 password
 });

 alert("Candidate created successfully");

 setName("");
 setEmail("");
 setPassword("");

 loadCandidates();

 }catch(err){

 alert("Error creating candidate");

 }

};


// Create interview
const createInterview = async () => {

 if(!candidateId){
  alert("Please select candidate");
  return;
 }

 try{

 await API.post("/interview/create",{
 candidateId,
 task
 });

 alert("Interview created");

 setTask("");

 loadInterviews();

 }catch(err){

 alert("Interview creation failed");

 }

};


return(

<div style={{padding:"20px"}}>

<h2>Admin Dashboard</h2>


{/* Create Candidate */}

<h3>Create Candidate</h3>

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<br/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<br/>

<input
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<br/>

<button onClick={createCandidate}>
Create Candidate
</button>


<hr/>


{/* Candidate List */}

<h3>Candidates</h3>

{candidates.map(c=>(
<div key={c._id}>

<p>{c.name} ({c.email})</p>

<button onClick={()=>setCandidateId(c._id)}>
Select Candidate
</button>

</div>
))}


<hr/>


{/* Interview Task */}

<h3>Create Interview Task</h3>

<textarea
placeholder="Enter interview task"
value={task}
onChange={(e)=>setTask(e.target.value)}
/>

<br/>

<button onClick={createInterview}>
Create Interview
</button>


<hr/>


{/* Interviews */}

<h3>Interviews</h3>

{interviews.map(i=>(
<div key={i._id}>

<p>
Candidate: {i.candidate?.name}
</p>

<p>
Task: {i.task}
</p>

<button
onClick={()=>navigate(`/interview/${i.roomId}`)}
>
Join Meeting
</button>

</div>
))}

</div>

);

}

export default AdminDashboard;