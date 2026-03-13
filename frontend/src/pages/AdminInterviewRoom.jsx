import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io("https://real-time-coding-interview-h6in.onrender.com");

export default function AdminInterviewRoom(){

const { roomId } = useParams();
const navigate = useNavigate();

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

socket.on("call-ended",()=>{
alert("Candidate left the interview");
navigate("/admin");
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

const track = localStream.current.getVideoTracks()[0];
track.enabled = !track.enabled;

setCameraOn(track.enabled);

};

const toggleMic = ()=>{

const track = localStream.current.getAudioTracks()[0];
track.enabled = !track.enabled;

setMicOn(track.enabled);

};

const assignTask = ()=>{
socket.emit("assign-task",{roomId,task});
};

const endCall = ()=>{

if(localStream.current){
localStream.current.getTracks().forEach(track=>track.stop());
}

if(peerConnection.current){
peerConnection.current.close();
}

socket.emit("end-call",roomId);

navigate("/admin");

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

<button
onClick={endCall}
style={{
marginLeft:"10px",
background:"#ef4444",
color:"white",
padding:"8px 12px",
border:"none",
borderRadius:"6px",
cursor:"pointer"
}}
>
End Interview
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