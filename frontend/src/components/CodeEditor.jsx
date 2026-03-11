import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { socket } from "../services/socket";

export default function CodeEditor({ room }) {

  const [code,setCode] = useState("");

  useEffect(()=>{

    socket.on("codeUpdate",(newCode)=>{
      setCode(newCode);
    });

  },[]);

  const changeCode = (value)=>{

    setCode(value);

    socket.emit("codeChange",{
      room,
      code:value
    });
  };

  return(

    <Editor
      height="400px"
      language="javascript"
      value={code}
      onChange={changeCode}
    />

  )
}