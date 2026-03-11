import {useRef,useEffect} from "react"
import io from "socket.io-client"

const socket = io("http://localhost:5000")

export default function AdminInterviewRoom(){

const localVideo = useRef()
const remoteVideo = useRef()

useEffect(()=>{

navigator.mediaDevices.getUserMedia({
video:true,
audio:true
}).then(stream=>{

localVideo.current.srcObject=stream

})

},[])

return(

<div>

<h2>Admin Interview Room</h2>

<video ref={localVideo} autoPlay playsInline width="300"/>

<video ref={remoteVideo} autoPlay playsInline width="300"/>

</div>

)

}