import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io("https://real-time-coding-interview-h6in.onrender.com");

export default function CandidateInterviewRoom(){

const {roomId} = useParams();

const localVideo = useRef();
const remoteVideo = useRef();
const screenVideo = useRef();

const peerConnection = useRef();
const localStream = useRef();

const [task,setTask] = useState("");
const [code,setCode] = useState("");
const [screenActive,setScreenActive] = useState(false);

useEffect(()=>{

startVideo();

socket.on("receive-task",(task)=>{
setTask(task);
});

},[]);

const startVideo = async ()=>{

// Get camera
const stream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
});

localStream.current = stream;
localVideo.current.srcObject = stream;

socket.emit("join-room",roomId);

// Create peer connection
peerConnection.current = new RTCPeerConnection();

// Send local tracks
stream.getTracks().forEach(track=>{
peerConnection.current.addTrack(track,stream);
});

// Receive remote tracks
peerConnection.current.ontrack=(event)=>{

const incomingStream = event.streams[0];

if(!remoteVideo.current.srcObject){
remoteVideo.current.srcObject = incomingStream;
}else{
screenVideo.current.srcObject = incomingStream;
setScreenActive(true);
}

};

// ICE candidates
peerConnection.current.onicecandidate=(event)=>{
if(event.candidate){
socket.emit("ice-candidate",{roomId,candidate:event.candidate});
}
};

// When admin joins create offer
socket.on("user-joined", async ()=>{

const offer = await peerConnection.current.createOffer();
await peerConnection.current.setLocalDescription(offer);

socket.emit("offer",{roomId,offer});

});

// Receive offer
socket.on("offer", async (offer)=>{

await peerConnection.current.setRemoteDescription(offer);

const answer = await peerConnection.current.createAnswer();
await peerConnection.current.setLocalDescription(answer);

socket.emit("answer",{roomId,answer});

});

// Receive answer
socket.on("answer", async (answer)=>{
await peerConnection.current.setRemoteDescription(answer);
});

// ICE candidate
socket.on("ice-candidate", async (candidate)=>{
await peerConnection.current.addIceCandidate(candidate);
});

};

// Screen share
const shareScreen = async ()=>{

const screenStream = await navigator.mediaDevices.getDisplayMedia({
video:true
});

const screenTrack = screenStream.getVideoTracks()[0];

peerConnection.current.addTrack(screenTrack,screenStream);

setScreenActive(true);

};

// Submit code
const submitCode = ()=>{
socket.emit("submit-code",{roomId,code});
};

return(

<div style={{padding:"20px"}}>

<h2>Candidate Interview Room</h2>

<div style={{display:"flex",gap:"40px"}}>

<div>
<h4>Your Camera</h4>
<video ref={localVideo} autoPlay playsInline muted width="250"/>
</div>

<div>
<h4>Admin Camera</h4>
<video ref={remoteVideo} autoPlay playsInline width="250"/>
</div>

</div>

{screenActive && (

<div style={{marginTop:"20px"}}>

<h4>Shared Screen</h4>

<video
ref={screenVideo}
autoPlay
playsInline
width="600"
/>

</div>

)}

<br/>

<button onClick={shareScreen}>
Share Screen
</button>

<hr/>

<h3>Task</h3>

<div style={{background:"#eee",padding:"10px"}}>
{task || "Waiting for admin task"}
</div>

<hr/>

<Editor
height="400px"
defaultLanguage="javascript"
value={code}
onChange={(v)=>setCode(v)}
/>

<button onClick={submitCode}>
Submit Answer
</button>

</div>

);

}