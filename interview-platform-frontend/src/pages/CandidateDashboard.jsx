import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CandidateDashboard(){

 const [interview,setInterview] = useState(null);
 const [tasks,setTasks] = useState([]);
 const [answer,setAnswer] = useState("");

 const navigate = useNavigate();

 useEffect(()=>{

  loadInterview();
  loadTasks();

 },[]);

 const loadInterview = async () => {

  try{

   const res = await API.get("/interview");

   setInterview(res.data);

  }catch(err){
   console.log(err);
  }

 };

 const loadTasks = async () => {

  try{

   const res = await API.get("/tasks/candidate");

   setTasks(res.data);

  }catch(err){
   console.log(err);
  }

 };

 const submitAnswer = async (taskId) => {

  try{

   await API.post("/tasks/submit",{
    taskId,
    answer
   });

   alert("Answer submitted successfully");

   setAnswer("");

  }catch(err){
   console.log(err);
  }

 };

 return(

  <div style={{padding:"20px"}}>

   <h2>Candidate Dashboard</h2>

   {/* Interview Section */}

   {interview && (

    <div>

     <h3>{interview.title}</h3>

     <button
     onClick={()=>navigate("/room/"+interview.roomId)}
     >
      Join Interview
     </button>

    </div>

   )}

   <hr/>

   {/* Task Section */}

   <h3>Your Tasks</h3>

   {tasks.length === 0 && <p>No tasks assigned yet</p>}

   {tasks.map((task)=>(
    <div key={task._id} style={{marginBottom:"20px"}}>

     <h4>Task</h4>

     <p>{task.task}</p>

     <textarea
     rows="6"
     cols="60"
     placeholder="Write your answer here..."
     value={answer}
     onChange={(e)=>setAnswer(e.target.value)}
     />

     <br/><br/>

     <button onClick={()=>submitAnswer(task._id)}>
      Submit Answer
     </button>

    </div>
   ))}

  </div>

 );
}

export default CandidateDashboard;