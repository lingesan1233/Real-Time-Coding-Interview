import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CandidateDashboard(){

  const nav = useNavigate();

  const [room,setRoom] = useState("");

  return(

    <div style={{padding:30}}>

      <h2>Candidate Dashboard</h2>

      <input
        placeholder="Interview Room ID"
        onChange={e=>setRoom(e.target.value)}
      />

      <br/><br/>

      <button
        onClick={()=>nav(`/interview/${room}`)}
      >
        Join Interview
      </button>

    </div>

  )

}