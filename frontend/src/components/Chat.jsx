import { useState,useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat({roomId}){

const[msg,setMsg]=useState("");
const[messages,setMessages]=useState([]);

useEffect(()=>{

socket.emit("joinRoom",roomId);

socket.on("chat",(data)=>{

setMessages(prev=>[...prev,data]);

});

},[]);

const sendMessage = ()=>{

socket.emit("chat",{
roomId,
message:msg
});

setMessages([...messages,msg]);

setMsg("");

};

return(

<div style={{border:"1px solid gray",padding:"10px"}}>

<h4>Chat</h4>

<div style={{height:"150px",overflow:"auto"}}>

{messages.map((m,i)=>(
<p key={i}>{m}</p>
))}

</div>

<input
value={msg}
onChange={e=>setMsg(e.target.value)}
placeholder="message"
/>

<button onClick={sendMessage}>
Send
</button>

</div>

);

}

export default Chat;