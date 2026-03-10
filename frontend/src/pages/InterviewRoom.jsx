import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import Editor from "@monaco-editor/react"
import AgoraRTC from "agora-rtc-sdk-ng"

import Navbar from "../components/Navbar"
import TaskPanel from "../components/TaskPanel"

const socket = io("http://localhost:5000")

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

const joinVideo = async () => {

const APP_ID = import.meta.env.VITE_AGORA_APP_ID

await client.join(APP_ID, roomId, null, null)

const tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

setLocalTracks(tracks)

await client.publish(tracks)

tracks[1].play("local-video")

client.on("user-published", async (user, mediaType) => {

await client.subscribe(user, mediaType)

if(mediaType === "video"){
user.videoTrack.play("remote-video")
}

if(mediaType === "audio"){
user.audioTrack.play()
}

})

setJoined(true)

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
// LOAD TASKS (from backend)
// =======================

useEffect(()=>{

const loadTasks = async ()=>{

try{

const res = await fetch(`http://localhost:5000/api/interview/tasks/${roomId}`)

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


{/* JOIN BUTTON */}

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

<h4>Remote Camera</h4>

<div
id="remote-video"
style={{
width:"300px",
height:"200px",
background:"black"
}}
></div>

</div>

</div>


{/* MAIN INTERVIEW LAYOUT */}

<div style={{
display:"flex",
marginTop:"30px",
gap:"20px"
}}>


{/* TASK PANEL */}

<TaskPanel tasks={tasks}/>


{/* CODE EDITOR */}

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