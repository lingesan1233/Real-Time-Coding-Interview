import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function CandidateDashboard(){

const [interviews,setInterviews] = useState([])

const navigate = useNavigate()

// get logged in user
const user = JSON.parse(localStorage.getItem("user"))

useEffect(()=>{

const loadInterviews = async ()=>{

try{

// send candidate id
const res = await api.get(`/candidate/interviews/${user._id}`)

setInterviews(res.data)

}catch(err){
console.log(err)
}

}

loadInterviews()

},[user._id])


return(

<div>

<Navbar/>

<div style={{padding:"20px"}}>

<h2>Candidate Dashboard</h2>

{interviews.length === 0 && (
<p>No interviews scheduled</p>
)}

{interviews.map((interview)=>(

<div key={interview._id} style={{
border:"1px solid gray",
padding:"15px",
margin:"15px 0"
}}>

<h4>Interview Room : {interview.roomId}</h4>

<p>Status: {interview.status}</p>

<button
onClick={()=>navigate(`/interview/${interview.roomId}`)}
>
Join Now
</button>

</div>

))}

</div>

</div>

)

}