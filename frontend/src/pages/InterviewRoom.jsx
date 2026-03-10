import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AgoraRTC from "agora-rtc-sdk-ng"

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

export default function InterviewRoom(){

const { roomId } = useParams()

const [localTracks,setLocalTracks] = useState([])

useEffect(()=>{

const startVideo = async () => {

const APP_ID = import.meta.env.VITE_AGORA_APP_ID

// join channel
await client.join(APP_ID, roomId, null, null)

// create mic + camera
const tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

setLocalTracks(tracks)

// publish tracks
await client.publish(tracks)

// play local camera
tracks[1].play("local-player")

}

// when remote user joins
client.on("user-published", async (user, mediaType) => {

await client.subscribe(user, mediaType)

if(mediaType === "video"){

const remoteContainer = document.createElement("div")

remoteContainer.id = user.uid
remoteContainer.style.width = "300px"
remoteContainer.style.height = "200px"

document.getElementById("remote-container").appendChild(remoteContainer)

user.videoTrack.play(remoteContainer)

}

if(mediaType === "audio"){
user.audioTrack.play()
}

})

startVideo()

},[roomId])

return(

<div>

<h2>Interview Room</h2>

<div style={{display:"flex",gap:"20px"}}>

<div>
<h3>Your Camera</h3>
<div
id="local-player"
style={{
width:"300px",
height:"200px",
background:"black"
}}
></div>
</div>

<div>
<h3>Candidate / Admin Camera</h3>
<div
id="remote-container"
style={{
display:"flex",
gap:"10px"
}}
></div>
</div>

</div>

</div>

)

}