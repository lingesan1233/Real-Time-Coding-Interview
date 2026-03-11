import Editor from "@monaco-editor/react"
import {useState} from "react"

export default function TaskPanel(){

const [code,setCode]=useState("")

return(

<div>

<Editor
height="400px"
defaultLanguage="javascript"
value={code}
onChange={setCode}
/>

</div>

)

}