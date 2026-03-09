import { useState } from "react";

function Chat({socket,roomId}){

 const [msg,setMsg]=useState("");
 const [messages,setMessages]=useState([]);

 const send=()=>{

  socket.emit("chat-message",{roomId,message:msg});

  setMessages([...messages,msg]);

 };

 socket.on("chat-message",(m)=>{

  setMessages((prev)=>[...prev,m]);

 });

 return(

  <div>

   <h3>Chat</h3>

   {messages.map((m,i)=>(
    <p key={i}>{m}</p>
   ))}

   <input
   onChange={(e)=>setMsg(e.target.value)}
   />

   <button onClick={send}>Send</button>

  </div>

 );

}

export default Chat;