import Editor from "@monaco-editor/react";
import {useState} from "react";

function CodeEditor(){

const[code,setCode]=useState("");

return(

<Editor
height="400px"
defaultLanguage="javascript"
value={code}
onChange={(value)=>setCode(value)}
/>

)

}

export default CodeEditor