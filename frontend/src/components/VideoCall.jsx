import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function VideoCall({ roomId }) {

const localVideo = useRef(null);
const remoteVideo = useRef(null);
const peerConnection = useRef(null);

useEffect(()=>{

initCall();

},[]);

const initCall = async () => {

const stream = await navigator.mediaDevices.getUserMedia({
 video:true,
 audio:true
});

localVideo.current.srcObject = stream;

peerConnection.current = new RTCPeerConnection({
 iceServers:[{ urls:"stun:stun.l.google.com:19302"}]
});

stream.getTracks().forEach(track=>{
 peerConnection.current.addTrack(track,stream);
});

peerConnection.current.ontrack = (event)=>{
 console.log("Remote stream received");
 remoteVideo.current.srcObject = event.streams[0];
};

peerConnection.current.onicecandidate = (event)=>{
 if(event.candidate){
  socket.emit("iceCandidate",{
   roomId,
   candidate:event.candidate
  });
 }
};

socket.emit("joinRoom",roomId);

socket.on("userJoined",async ()=>{

 console.log("Second user joined");

 const offer = await peerConnection.current.createOffer();

 await peerConnection.current.setLocalDescription(offer);

 socket.emit("offer",{roomId,offer});

});

socket.on("offer",async (offer)=>{

 console.log("Offer received");

 await peerConnection.current.setRemoteDescription(
  new RTCSessionDescription(offer)
 );

 const answer = await peerConnection.current.createAnswer();

 await peerConnection.current.setLocalDescription(answer);

 socket.emit("answer",{roomId,answer});

});

socket.on("answer",async (answer)=>{

 console.log("Answer received");

 await peerConnection.current.setRemoteDescription(
  new RTCSessionDescription(answer)
 );

});

socket.on("iceCandidate",async (candidate)=>{

 try{
  await peerConnection.current.addIceCandidate(
   new RTCIceCandidate(candidate)
  );
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