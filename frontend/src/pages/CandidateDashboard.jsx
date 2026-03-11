import {useEffect,useState} from "react"
import api from "../services/api"
import {useNavigate} from "react-router-dom"

export default function CandidateDashboard(){

const user = JSON.parse(localStorage.getItem("user"))

const [interviews,setInterviews]=useState([])

const navigate = useNavigate()

useEffect(()=>{

api.get(`/interview/candidate/${user._id}`)
.then(res=>setInterviews(res.data))

},[])

return(

<div>

<h1>Candidate Dashboard</h1>

{interviews.map(i=>(

<div key={i.roomId}>

<p>{i.task}</p>

<button onClick={()=>navigate(`/candidate-room/${i.roomId}`)}>
Join Now
</button>

</div>

))}

</div>

)

}