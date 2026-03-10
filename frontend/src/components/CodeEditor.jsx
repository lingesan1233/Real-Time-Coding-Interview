import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import {useEffect,useState} from "react";

const socket = io("http://localhost:5000");

function CodeEditor({roomId}){

const [code,setCode]=useState("");

useEffect(()=>{

socket.emit("joinRoom",roomId);

socket.on("codeUpdate",(newCode)=>{
setCode(newCode);
});

},[]);

const handleChange=(value)=>{

setCode(value);

socket.emit("codeChange",{
roomId,
code:value
});

};

return(

<Editor
height="400px"
language="javascript"
theme="vs-dark"
value={code}
onChange={handleChange}
/>

)

}

export default CodeEditor;