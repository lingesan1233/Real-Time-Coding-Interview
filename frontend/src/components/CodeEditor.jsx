import Editor from "@monaco-editor/react"
import {useEffect,useState} from "react"
import {io} from "socket.io-client"

const socket = io("http://localhost:5000")

export default function CodeEditor({room}){

const [code,setCode] = useState("")

useEffect(()=>{
socket.emit("joinRoom",room)

socket.on("codeUpdate",(data)=>{
setCode(data)
})

},[])

const handleChange = (value)=>{

setCode(value)

socket.emit("codeChange",{
room,
code:value
})

}

return(

<Editor
height="500px"
defaultLanguage="javascript"
value={code}
onChange={handleChange}
/>

)

}