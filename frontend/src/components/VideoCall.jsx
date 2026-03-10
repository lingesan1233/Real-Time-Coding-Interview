import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function VideoCall({ roomId }) {

const localVideo = useRef(null);
const remoteVideo = useRef(null);

let peerConnection;

const servers = {
 iceServers: [
  { urls: "stun:stun.l.google.com:19302" }
 ]
};

useEffect(() => {

startCamera();

}, []);

const startCamera = async () => {

const stream = await navigator.mediaDevices.getUserMedia({
 video: true,
 audio: true
});

localVideo.current.srcObject = stream;

peerConnection = new RTCPeerConnection(servers);

stream.getTracks().forEach(track => {
 peerConnection.addTrack(track, stream);
});

peerConnection.ontrack = (event) => {
 remoteVideo.current.srcObject = event.streams[0];
};

peerConnection.onicecandidate = (event) => {
 if(event.candidate){
  socket.emit("iceCandidate", {
   roomId,
   candidate: event.candidate
  });
 }
};

socket.emit("joinRoom", roomId);


// when both users ready
socket.on("ready", async () => {

 const offer = await peerConnection.createOffer();
 await peerConnection.setLocalDescription(offer);

 socket.emit("offer", {
  roomId,
  offer
 });

});


socket.on("offer", async (offer) => {

 await peerConnection.setRemoteDescription(offer);

 const answer = await peerConnection.createAnswer();
 await peerConnection.setLocalDescription(answer);

 socket.emit("answer", {
  roomId,
  answer
 });

});


socket.on("answer", async (answer) => {

 await peerConnection.setRemoteDescription(answer);

});


socket.on("iceCandidate", async (candidate) => {

 try{
  await peerConnection.addIceCandidate(candidate);
 }catch(err){
  console.log(err);
 }

});

};


return(

<div style={{display:"flex",gap:"20px"}}>

<div>
<h3>Your Camera</h3>
<video ref={localVideo} autoPlay muted playsInline width="300"/>
</div>

<div>
<h3>Remote Camera</h3>
<video ref={remoteVideo} autoPlay playsInline width="300"/>
</div>

</div>

);

}

export default VideoCall;