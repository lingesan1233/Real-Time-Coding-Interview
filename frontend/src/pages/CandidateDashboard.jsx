import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../services/api";

function CandidateDashboard(){

const [interviews,setInterviews]=useState([]);
const navigate = useNavigate();

useEffect(()=>{

loadInterviews();

},[]);

const loadInterviews=async()=>{

const res = await API.get("/interview/candidate");

setInterviews(res.data);

};

return(

<div>

<h2>Candidate Dashboard</h2>

{interviews.map(i=>(
<div key={i._id}>

<p>{i.task}</p>

<button
onClick={()=>navigate(`/interview/${i.roomId}`)}
>
Join Interview
</button>

</div>
))}

</div>

)

}

export default CandidateDashboard;