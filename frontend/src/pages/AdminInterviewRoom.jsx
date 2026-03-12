import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io("https://real-time-coding-interview-h6in.onrender.com");

export default function AdminInterviewRoom(){

const { roomId } = useParams();

const localVideo = useRef();
const remoteVideo = useRef();

const peerConnection = useRef();
const localStream = useRef();

const [task,setTask] = useState("");
const [candidateCode,setCandidateCode] = useState("");

const [cameraOn,setCameraOn] = useState(true);
const [micOn,setMicOn] = useState(true);

useEffect(()=>{

startVideo();

socket.on("receive-submission",(data)=>{
setCandidateCode(data.code);
});

},[]);

const startVideo = async ()=>{

const stream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
});

localStream.current = stream;
localVideo.current.srcObject = stream;

peerConnection.current = new RTCPeerConnection();

stream.getTracks().forEach(track=>{
peerConnection.current.addTrack(track,stream);
});

peerConnection.current.ontrack=(event)=>{
remoteVideo.current.srcObject = event.streams[0];
};

peerConnection.current.onicecandidate=(event)=>{
if(event.candidate){
socket.emit("ice-candidate",{roomId,candidate:event.candidate});
}
};

socket.emit("join-room",roomId);

socket.on("user-joined",async()=>{

const offer = await peerConnection.current.createOffer();

await peerConnection.current.setLocalDescription(offer);

socket.emit("offer",{roomId,offer});

});

socket.on("answer",async(answer)=>{
await peerConnection.current.setRemoteDescription(answer);
});

socket.on("ice-candidate",async(candidate)=>{
await peerConnection.current.addIceCandidate(candidate);
});

};

socket.on("offer", async (offer)=>{

await peerConnection.current.setRemoteDescription(offer);

const answer = await peerConnection.current.createAnswer();

await peerConnection.current.setLocalDescription(answer);

socket.emit("answer",{roomId,answer});

});

const toggleCamera = ()=>{

localStream.current.getVideoTracks()[0].enabled =
!localStream.current.getVideoTracks()[0].enabled;

setCameraOn(localStream.current.getVideoTracks()[0].enabled);

};

const toggleMic = ()=>{

localStream.current.getAudioTracks()[0].enabled =
!localStream.current.getAudioTracks()[0].enabled;

setMicOn(localStream.current.getAudioTracks()[0].enabled);

};

const assignTask = ()=>{
socket.emit("assign-task",{roomId,task});
};

return(

<div style={{padding:"20px"}}>

<h2>Admin Interview Room</h2>

<div style={{display:"flex",gap:"40px"}}>

<div>
<h4>Admin Camera</h4>
<video ref={localVideo} autoPlay playsInline muted width="250"/>
</div>

<div>
<h4>Candidate Camera</h4>
<video ref={remoteVideo} autoPlay playsInline width="250"/>
</div>

</div>

<br/>

<button onClick={toggleCamera}>
{cameraOn ? "Turn Camera Off" : "Turn Camera On"}
</button>

<button onClick={toggleMic} style={{marginLeft:"10px"}}>
{micOn ? "Mute Mic" : "Unmute Mic"}
</button>

<hr/>

<h3>Assign Task</h3>

<textarea
rows="4"
style={{width:"400px"}}
onChange={(e)=>setTask(e.target.value)}
/>

<br/>

<button onClick={assignTask}>
Send Task
</button>

<hr/>

<h3>Candidate Submission</h3>

<Editor
height="400px"
defaultLanguage="javascript"
value={candidateCode}
/>

</div>

);

}