import {useState,useEffect} from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat({roomId}){

const [msg,setMsg]=useState("");
const [messages,setMessages]=useState([]);

useEffect(()=>{

socket.emit("joinRoom",roomId);

socket.on("chatMessage",(data)=>{
setMessages(prev=>[...prev,data]);
});

},[]);

const sendMessage=()=>{

socket.emit("chatMessage",{
roomId,
message:msg
});

setMsg("");

};

return(

<div>

<h3>Chat</h3>

{messages.map((m,i)=>(
<p key={i}>{m.message}</p>
))}

<input
value={msg}
onChange={(e)=>setMsg(e.target.value)}
/>

<button onClick={sendMessage}>
Send
</button>

</div>

)

}

export default Chat;