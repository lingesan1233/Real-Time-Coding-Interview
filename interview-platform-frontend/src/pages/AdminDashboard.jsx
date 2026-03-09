import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

 const [title,setTitle] = useState("");
 const [description,setDescription] = useState("");
 const [candidateId,setCandidateId] = useState("");
 const [task,setTask] = useState("");

 const navigate = useNavigate();

 const createInterview = async () => {

  try{

   const res = await API.post("/interview/create",{
    title,
    description,
    candidateId
   });

   alert("Interview Created");

   navigate("/room/" + res.data.roomId);

  }catch(err){
   console.log(err);
   alert("Error creating interview");
  }

 };

 const assignTask = async () => {

  try{

   await API.post("/tasks/create",{
    candidateId,
    task
   });

   alert("Task Assigned to Candidate");

   setTask("");

  }catch(err){
   console.log(err);
   alert("Error assigning task");
  }

 };

 return(

  <div style={{padding:"20px"}}>

   <h2>Admin Dashboard</h2>

   {/* Interview Creation */}

   <h3>Create Interview Meeting</h3>

   <input
   placeholder="Interview Title"
   value={title}
   onChange={(e)=>setTitle(e.target.value)}
   />

   <br/><br/>

   <input
   placeholder="Interview Description"
   value={description}
   onChange={(e)=>setDescription(e.target.value)}
   />

   <br/><br/>

   <input
   placeholder="Candidate ID"
   value={candidateId}
   onChange={(e)=>setCandidateId(e.target.value)}
   />

   <br/><br/>

   <button onClick={createInterview}>
    Start Interview
   </button>

   <hr/>

   {/* Task Creation */}

   <h3>Create Task for Candidate</h3>

   <textarea
   rows="6"
   cols="60"
   placeholder="Write coding task for candidate..."
   value={task}
   onChange={(e)=>setTask(e.target.value)}
   />

   <br/><br/>

   <button onClick={assignTask}>
    Assign Task
   </button>

  </div>

 );

}

export default AdminDashboard;