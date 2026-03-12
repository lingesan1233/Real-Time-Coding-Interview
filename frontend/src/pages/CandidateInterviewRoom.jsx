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

const stream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
});

localVideo.current.srcObject = stream;

peerConnection.current = new RTCPeerConnection();

stream.getTracks().forEach(track=>{
peerConnection.current.addTrack(track,stream);
});

peerConnection.current.ontrack = (event)=>{

const track = event.track;
const stream = new MediaStream([track]);

if(track.kind === "video"){

if(!remoteVideo.current.srcObject){
remoteVideo.current.srcObject = stream;
}else{
screenVideo.current.srcObject = stream;
setScreenActive(true);
}

}

};

peerConnection.current.onicecandidate=(event)=>{
if(event.candidate){
socket.emit("ice-candidate",{roomId,candidate:event.candidate});
}
};

socket.emit("join-room",roomId);

socket.on("offer", async (offer)=>{

await peerConnection.current.setRemoteDescription(offer);

const answer = await peerConnection.current.createAnswer();

await peerConnection.current.setLocalDescription(answer);

socket.emit("answer",{roomId,answer});

});

socket.on("answer", async (answer)=>{
await peerConnection.current.setRemoteDescription(answer);
});

socket.on("ice-candidate", async (candidate)=>{
await peerConnection.current.addIceCandidate(candidate);
});

socket.on("renegotiate-offer", async (offer)=>{

await peerConnection.current.setRemoteDescription(offer);

const answer = await peerConnection.current.createAnswer();

await peerConnection.current.setLocalDescription(answer);

socket.emit("renegotiate-answer",{roomId,answer});

});

socket.on("renegotiate-answer", async (answer)=>{
await peerConnection.current.setRemoteDescription(answer);
});

};

const shareScreen = async ()=>{

const screenStream = await navigator.mediaDevices.getDisplayMedia({
video:true
});

const screenTrack = screenStream.getVideoTracks()[0];

peerConnection.current.addTrack(screenTrack,screenStream);

const offer = await peerConnection.current.createOffer();

await peerConnection.current.setLocalDescription(offer);

socket.emit("renegotiate-offer",{roomId,offer});

setScreenActive(true);

};

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

<video ref={screenVideo} autoPlay playsInline width="650"/>

<br/>

<button onClick={()=>screenVideo.current.requestFullscreen()}>
Maximize Screen
</button>

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