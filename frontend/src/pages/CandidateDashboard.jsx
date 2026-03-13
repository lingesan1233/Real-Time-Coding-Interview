import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CandidateDashboard() {

const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));

const [interviews,setInterviews] = useState([]);

useEffect(()=>{
loadInterviews();
},[]);

const loadInterviews = async ()=>{

try{

const res = await api.get(`/interview/candidate/${user._id}`);
setInterviews(res.data);

}catch(err){

console.log(err);

}

};

return(

<div style={styles.page}>

{/* HEADER */}

<div style={styles.header}>

<div>

<h1 style={styles.title}>
Welcome back, {user.name}
</h1>

<p style={styles.subtitle}>
Manage and attend your coding interviews
</p>

</div>

<div style={styles.roleBadge}>
Candidate
</div>

</div>


{/* DASHBOARD STATS */}

<div style={styles.statsContainer}>

<div style={styles.statCard}>
<h3>{interviews.length}</h3>
<p>Total Interviews</p>
</div>

<div style={styles.statCard}>
<h3>
{interviews.filter(i=>!i.status || i.status==="Scheduled").length}
</h3>
<p>Scheduled</p>
</div>

<div style={styles.statCard}>
<h3>
{interviews.filter(i=>i.status==="Completed").length}
</h3>
<p>Completed</p>
</div>

</div>


{/* PROFILE */}

<div style={styles.profileCard}>

<h2>My Profile</h2>

<div style={styles.profileGrid}>

<div>
<p style={styles.label}>Name</p>
<p>{user.name}</p>
</div>

<div>
<p style={styles.label}>Email</p>
<p>{user.email}</p>
</div>

<div>
<p style={styles.label}>Role</p>
<p>Candidate</p>
</div>

</div>

</div>


{/* INTERVIEWS */}

<h2 style={styles.sectionTitle}>Upcoming Interviews</h2>

{interviews.length === 0 && (

<div style={styles.emptyCard}>
No interviews scheduled yet
</div>

)}

<div style={styles.grid}>

{interviews.map((interview)=>(

<div key={interview.roomId} style={styles.interviewCard}>

<div>

<p style={styles.room}>
Room ID: {interview.roomId}
</p>

<span style={styles.statusBadge}>
{interview.status || "Scheduled"}
</span>

<p style={styles.task}>
{interview.task?.substring(0,120)}...
</p>

</div>

<button
style={styles.joinBtn}
onClick={()=>navigate(`/candidate-room/${interview.roomId}`)}
>

Join Interview

</button>

</div>

))}

</div>

</div>

);

}

const styles={

page:{
padding:"100px 40px",
background:"linear-gradient(135deg,#0f172a,#020617)",
minHeight:"100vh",
color:"#f8fafc",
fontFamily:"Inter, sans-serif"
},

header:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"40px"
},

title:{
fontSize:"32px",
fontWeight:"700",
margin:0
},

subtitle:{
color:"#94a3b8"
},

roleBadge:{
background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
padding:"10px 16px",
borderRadius:"10px",
fontWeight:"600"
},

statsContainer:{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px",
marginBottom:"35px"
},

statCard:{
background:"rgba(255,255,255,0.05)",
padding:"25px",
borderRadius:"14px",
textAlign:"center",
border:"1px solid rgba(255,255,255,0.05)"
},

profileCard:{
background:"rgba(255,255,255,0.05)",
padding:"25px",
borderRadius:"14px",
marginBottom:"35px",
border:"1px solid rgba(255,255,255,0.05)"
},

profileGrid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px",
marginTop:"15px"
},

label:{
fontSize:"13px",
color:"#94a3b8"
},

sectionTitle:{
marginBottom:"20px",
fontSize:"22px"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
gap:"20px"
},

interviewCard:{
background:"rgba(255,255,255,0.05)",
padding:"22px",
borderRadius:"14px",
border:"1px solid rgba(255,255,255,0.05)",
display:"flex",
flexDirection:"column",
justifyContent:"space-between",
gap:"12px"
},

room:{
fontWeight:"600",
marginBottom:"6px"
},

statusBadge:{
display:"inline-block",
background:"#22c55e",
padding:"4px 10px",
borderRadius:"6px",
fontSize:"12px",
marginBottom:"10px"
},

task:{
fontSize:"13px",
color:"#cbd5f5"
},

joinBtn:{
marginTop:"10px",
padding:"10px",
border:"none",
borderRadius:"8px",
background:"linear-gradient(90deg,#ff512f,#dd2476)",
color:"white",
cursor:"pointer",
fontWeight:"600"
},

emptyCard:{
background:"rgba(255,255,255,0.05)",
padding:"30px",
borderRadius:"14px",
textAlign:"center",
color:"#94a3b8"
}

};