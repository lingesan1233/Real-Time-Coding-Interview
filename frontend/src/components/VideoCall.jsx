import AgoraRTC from "agora-rtc-sdk-ng"
import {useEffect} from "react"

const client = AgoraRTC.createClient({mode:"rtc",codec:"vp8"})

export default function VideoCall({room}){

useEffect(()=>{

const start = async ()=>{

await client.join(
import.meta.env.VITE_AGORA_APP_ID,
room,
null,
null
)

const tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

await client.publish(tracks)

}

start()

},[])

return(

<div>
<h2>Video Call Running</h2>
</div>

)

}