import Editor from "@monaco-editor/react";

function CodeEditor({code,setCode}){

 return(

  <Editor
   height="400px"
   language="javascript"
   value={code}
   onChange={(value)=>setCode(value)}
  />

 );

}

export default CodeEditor;