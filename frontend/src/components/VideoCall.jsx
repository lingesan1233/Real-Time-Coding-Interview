import { useEffect,useRef } from "react";
import { socket } from "../services/socket";

export default function VideoCall({roomId,role}){

const localVideo = useRef();
const remoteVideo = useRef();
const peer = useRef();

useEffect(()=>{

startCamera();

socket.emit("joinRoom",roomId);

socket.on("offer",handleOffer);
socket.on("answer",handleAnswer);
socket.on("ice-candidate",handleCandidate);

},[]);



const startCamera = async()=>{

const stream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
});

localVideo.current.srcObject = stream;

peer.current = new RTCPeerConnection();

stream.getTracks().forEach(track=>{
peer.current.addTrack(track,stream);
});

peer.current.ontrack = e=>{
remoteVideo.current.srcObject = e.streams[0];
};

peer.current.onicecandidate = e=>{
if(e.candidate){
socket.emit("ice-candidate",{
roomId,
candidate:e.candidate
});
}
};

if(role==="admin"){
createOffer();
}

};



const createOffer = async()=>{

const offer = await peer.current.createOffer();

await peer.current.setLocalDescription(offer);

socket.emit("offer",{
roomId,
offer
});

};



const handleOffer = async(data)=>{

await peer.current.setRemoteDescription(data.offer);

const answer = await peer.current.createAnswer();

await peer.current.setLocalDescription(answer);

socket.emit("answer",{
roomId,
answer
});

};



const handleAnswer = async(data)=>{

await peer.current.setRemoteDescription(data.answer);

};



const handleCandidate = async(data)=>{

try{
await peer.current.addIceCandidate(data.candidate);
}catch(err){}

};



return(

<div style={{display:"flex",gap:20}}>

<div>
<h4>Your Camera</h4>
<video ref={localVideo} autoPlay muted width="350"/>
</div>

<div>
<h4>Remote Camera</h4>
<video ref={remoteVideo} autoPlay width="350"/>
</div>

</div>

)

}