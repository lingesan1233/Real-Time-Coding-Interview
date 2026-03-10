import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import Navbar from "../components/Navbar"

export default function AdminDashboard(){

const navigate = useNavigate()

const [candidates,setCandidates] = useState([])
const [interviews,setInterviews] = useState([])

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const [candidateId,setCandidateId] = useState("")
const [tasks,setTasks] = useState("")

// Load candidates
const loadCandidates = async () => {
try{
const res = await api.get("/admin/candidates")
setCandidates(res.data)
}catch(err){
console.log(err)
}
}

// Load interviews
const loadInterviews = async () => {
try{
const res = await api.get("/admin/interviews")
setInterviews(res.data)
}catch(err){
console.log(err)
}
}

useEffect(()=>{
loadCandidates()
loadInterviews()
},[])


// Create candidate
const createCandidate = async () => {

if(!name || !email || !password){
return alert("Fill all fields")
}

try{

await api.post("/admin/createCandidate",{
name,
email,
password
})

alert("Candidate created successfully")

setName("")
setEmail("")
setPassword("")

// Reload candidates list
loadCandidates()

}catch(err){
alert("Error creating candidate")
}

}


// Create interview
const createInterview = async () => {

if(!candidateId){
return alert("Please select candidate")
}

if(!tasks){
return alert("Enter tasks")
}

try{

await api.post("/admin/createInterview",{
candidateId,
tasks:tasks.split(",")
})

alert("Interview scheduled")

setTasks("")

loadInterviews()

}catch(err){
alert("Error creating interview")
}

}


// Join interview
const joinInterview = (roomId)=>{
navigate(`/interview/${roomId}`)
}


// End interview
const endInterview = async(id)=>{

await api.put(`/admin/endInterview/${id}`)

alert("Interview ended")

loadInterviews()

}

return(

<div>

<Navbar/>

<div style={{padding:"30px"}}>

<h2>Admin Dashboard</h2>


<h3>Create Candidate</h3>

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={createCandidate}>
Create
</button>



<h3 style={{marginTop:"30px"}}>Candidates</h3>

<ul>

{candidates.map(c=>(
<li key={c._id}>
{c.name} ({c.email})
</li>
))}

</ul>



<h3 style={{marginTop:"30px"}}>Create Interview</h3>

<select
value={candidateId}
onChange={(e)=>setCandidateId(e.target.value)}
>

<option value="">Select Candidate</option>

{candidates.map((c)=>(
<option key={c._id} value={c._id}>
{c.name} - {c.email}
</option>
))}

</select>

<input
placeholder="Tasks (comma separated)"
value={tasks}
onChange={(e)=>setTasks(e.target.value)}
/>

<button onClick={createInterview}>
Create Interview
</button>



<h3 style={{marginTop:"30px"}}>Interviews</h3>

<table border="1" cellPadding="10">

<thead>
<tr>
<th>Room</th>
<th>Candidate</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{interviews.map(i=>(
<tr key={i._id}>

<td>{i.roomId}</td>

<td>{i.candidateId?.name}</td>

<td>{i.status}</td>

<td>

<button onClick={()=>joinInterview(i.roomId)}>
Join
</button>

<button onClick={()=>endInterview(i._id)}>
End
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

)

}