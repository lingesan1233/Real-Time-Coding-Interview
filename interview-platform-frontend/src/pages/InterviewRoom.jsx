import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import io from "socket.io-client";

import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import VideoCall from "../components/VideoCall";

const socket=io("http://localhost:5000");

function InterviewRoom(){

 const {roomId}=useParams();

 const [code,setCode]=useState("");

 useEffect(()=>{

  socket.emit("join-room",roomId);

 },[]);

 useEffect(()=>{

  socket.emit("code-change",{roomId,code});

 },[code]);

 socket.on("code-update",(c)=>{

  setCode(c);

 });

 return(

  <div>

   <h2>Interview Room</h2>

   <VideoCall/>

   <CodeEditor
   code={code}
   setCode={setCode}
   />

   <Chat
   socket={socket}
   roomId={roomId}
   />

  </div>

 );

}

export default InterviewRoom;