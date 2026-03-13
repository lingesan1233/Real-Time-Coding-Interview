import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {

const navigate = useNavigate();

const [candidates,setCandidates]=useState([]);
const [interviews,setInterviews]=useState([]);

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [selectedCandidate,setSelectedCandidate]=useState("");
const [task,setTask]=useState("");

useEffect(()=>{
loadCandidates();
},[]);

const loadCandidates = async ()=>{
const res = await api.get("/admin/candidates");
setCandidates(res.data);
};

const createCandidate = async ()=>{

if(!name || !email || !password){
alert("Fill all fields");
return;
}

await api.post("/admin/create-candidate",{name,email,password});

alert("Candidate Created");

setName("");
setEmail("");
setPassword("");

loadCandidates();
};

const createInterview = async ()=>{

if(!selectedCandidate || !task){
alert("Select candidate and task");
return;
}

const res = await api.post("/interview/create",{candidateId:selectedCandidate,task});

setInterviews([...interviews,res.data]);

alert("Interview Created");
};

return(

<div style={styles.page}>

{/* PAGE HEADER */}

<div style={styles.header}>

<div>
<h1 style={styles.title}>Admin Dashboard</h1>
<p style={styles.subtitle}>Manage candidates and schedule interviews</p>
</div>

</div>

{/* STATS */}

<div style={styles.stats}>

<div style={styles.statCard}>
<h2>{candidates.length}</h2>
<p>Total Candidates</p>
</div>

<div style={styles.statCard}>
<h2>{interviews.length}</h2>
<p>Scheduled Interviews</p>
</div>

</div>

{/* MAIN GRID */}

<div style={styles.grid}>

{/* CREATE CANDIDATE */}

<div style={styles.card}>

<h3>Create Candidate</h3>

<input
style={styles.input}
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
style={styles.input}
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
style={styles.input}
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button style={styles.primaryBtn} onClick={createCandidate}>
Create Candidate
</button>

</div>

{/* CREATE INTERVIEW */}

<div style={styles.card}>

<h3>Create Interview</h3>

<select
style={styles.input}
onChange={(e)=>setSelectedCandidate(e.target.value)}
>

<option>Select Candidate</option>

{candidates.map(c=>(
<option key={c._id} value={c._id}>
{c.name}
</option>
))}

</select>

<textarea
style={styles.textarea}
placeholder="Enter coding task"
onChange={(e)=>setTask(e.target.value)}
/>

<button style={styles.primaryBtn} onClick={createInterview}>
Create Interview
</button>

</div>

{/* CANDIDATE LIST */}

<div style={styles.card}>

<h3>Candidate List</h3>

{candidates.map(c=>(

<div key={c._id} style={styles.listRow}>

<div>
<b>{c.name}</b>
<p style={styles.email}>{c.email}</p>
</div>

</div>

))}

</div>

{/* INTERVIEW LIST */}

<div style={styles.card}>

<h3>Scheduled Interviews</h3>

{interviews.map(i=>(

<div key={i.roomId} style={styles.listRow}>

<div>
<b>Room:</b> {i.roomId}
<p style={styles.task}>{i.task.substring(0,70)}...</p>
</div>

<button
style={styles.startBtn}
onClick={()=>navigate(`/admin-room/${i.roomId}`)}
>
Start Interview
</button>

</div>

))}

</div>

</div>

</div>

);

}

const styles={

page:{
padding:"100px 40px",
background:"#f1f5f9",
minHeight:"100vh"
},

header:{
marginBottom:"30px"
},

title:{
fontSize:"34px",
marginBottom:"5px"
},

subtitle:{
color:"#64748b"
},

stats:{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:"20px",
marginBottom:"30px"
},

statCard:{
background:"linear-gradient(135deg,#ff512f,#dd2476)",
color:"white",
padding:"25px",
borderRadius:"12px",
textAlign:"center",
boxShadow:"0 6px 18px rgba(0,0,0,0.15)"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(350px,1fr))",
gap:"25px"
},

card:{
background:"white",
padding:"25px",
borderRadius:"14px",
boxShadow:"0 6px 20px rgba(0,0,0,0.08)",
display:"flex",
flexDirection:"column",
gap:"12px"
},

input:{
padding:"12px",
borderRadius:"8px",
border:"1px solid #e2e8f0",
fontSize:"14px"
},

textarea:{
padding:"12px",
borderRadius:"8px",
border:"1px solid #e2e8f0",
minHeight:"90px"
},

primaryBtn:{
marginTop:"10px",
padding:"12px",
border:"none",
borderRadius:"8px",
background:"linear-gradient(90deg,#ff512f,#dd2476)",
color:"white",
cursor:"pointer",
fontWeight:"600"
},

listRow:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"12px",
borderBottom:"1px solid #f1f5f9"
},

email:{
fontSize:"13px",
color:"#64748b"
},

task:{
fontSize:"13px",
color:"#475569"
},

startBtn:{
padding:"8px 16px",
border:"none",
background:"#22c55e",
color:"white",
borderRadius:"6px",
cursor:"pointer"
}

};