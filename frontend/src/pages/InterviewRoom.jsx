import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import Editor from "@monaco-editor/react"
import AgoraRTC from "agora-rtc-sdk-ng"

import Navbar from "../components/Navbar"
import TaskPanel from "../components/TaskPanel"

const socket = io(import.meta.env.VITE_API_URL)

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

export default function InterviewRoom(){

const { roomId } = useParams()
const navigate = useNavigate()

const [code,setCode] = useState("")
const [tasks,setTasks] = useState([])
const [localTracks,setLocalTracks] = useState([])
const [joined,setJoined] = useState(false)


// =======================
// SOCKET CODE SYNC
// =======================

useEffect(()=>{

socket.emit("joinRoom",roomId)

socket.on("codeUpdate",(data)=>{
setCode(data)
})

return ()=> socket.off("codeUpdate")

},[roomId])


const handleCodeChange = (value)=>{

setCode(value)

socket.emit("codeChange",{
room:roomId,
code:value
})

}


// =======================
// VIDEO CALL
// =======================

useEffect(()=>{

client.on("user-published", async (user, mediaType) => {

await client.subscribe(user, mediaType)

if(mediaType === "video"){

let remoteContainer = document.getElementById(`remote-${user.uid}`)

if(!remoteContainer){
remoteContainer = document.createElement("div")
remoteContainer.id = `remote-${user.uid}`
remoteContainer.style.width = "300px"
remoteContainer.style.height = "200px"
document.getElementById("remote-container").appendChild(remoteContainer)
}

user.videoTrack.play(remoteContainer)

}

if(mediaType === "audio"){
user.audioTrack.play()
}

})


client.on("user-unpublished",(user)=>{

const remoteContainer = document.getElementById(`remote-${user.uid}`)

if(remoteContainer){
remoteContainer.remove()
}

})

},[])



const joinVideo = async () => {

try{

const APP_ID = import.meta.env.VITE_AGORA_APP_ID

await client.join(APP_ID, roomId, null, null)

const tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

setLocalTracks(tracks)

await client.publish(tracks)

// play local camera
tracks[1].play("local-video")

setJoined(true)

}catch(err){
console.error("Agora join error:",err)
}

}


// =======================
// LEAVE MEETING
// =======================

const leaveMeeting = async () => {

localTracks.forEach(track => track.close())

await client.leave()

navigate("/")

}


// =======================
// SUBMIT SOLUTION
// =======================

const submitSolution = () => {

socket.emit("submitSolution",{
room:roomId,
code
})

alert("Solution submitted")

}


// =======================
// LOAD TASKS
// =======================

useEffect(()=>{

const loadTasks = async ()=>{

try{

const res = await fetch(`${import.meta.env.VITE_API_URL}/api/interview/tasks/${roomId}`)

const data = await res.json()

setTasks(data.tasks || [])

}catch(err){
console.log(err)
}

}

loadTasks()

},[roomId])



return(

<div>

<Navbar/>

<div style={{padding:"20px"}}>

<h2>Interview Room : {roomId}</h2>


{!joined && (
<button onClick={joinVideo}>
Join Interview
</button>
)}


{/* VIDEO SECTION */}

<div style={{
display:"flex",
gap:"20px",
marginTop:"20px"
}}>

<div>

<h4>Your Camera</h4>

<div
id="local-video"
style={{
width:"300px",
height:"200px",
background:"black"
}}
></div>

</div>


<div>

<h4>Participants</h4>

<div
id="remote-container"
style={{
display:"flex",
gap:"10px"
}}
></div>

</div>

</div>


{/* MAIN LAYOUT */}

<div style={{
display:"flex",
marginTop:"30px",
gap:"20px"
}}>

<TaskPanel tasks={tasks}/>

<div style={{width:"70%"}}>

<h3>Live Coding Editor</h3>

<Editor
height="500px"
defaultLanguage="javascript"
value={code}
onChange={handleCodeChange}
/>

<div style={{marginTop:"15px"}}>

<button onClick={submitSolution}>
Submit Solution
</button>

<button
onClick={leaveMeeting}
style={{marginLeft:"10px"}}
>
Leave Meeting
</button>

</div>

</div>

</div>

</div>

</div>

)

}