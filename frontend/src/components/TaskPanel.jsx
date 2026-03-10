import { useState } from "react";
import axios from "axios";

function TaskPanel({task,interviewId,code}){

const submitSolution = async()=>{

await axios.post(
`http://localhost:5000/api/interview/submit/${interviewId}`,
{answer:code}
);

alert("Solution submitted");

};

return(

<div style={{
border:"1px solid black",
padding:"10px",
marginBottom:"10px"
}}>

<h3>Task</h3>

<p>{task}</p>

<button onClick={submitSolution}>
Submit Answer
</button>

</div>

);

}

export default TaskPanel;