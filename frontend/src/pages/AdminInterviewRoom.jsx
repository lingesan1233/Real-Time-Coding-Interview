import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://your-backend-url.com");

export default function AdminInterviewRoom() {

  const { roomId } = useParams();

  const localVideo = useRef();
  const remoteVideo = useRef();

  const peerConnection = useRef();

  useEffect(() => {

    startVideo();

  }, []);

  const startVideo = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    localVideo.current.srcObject = stream;

    socket.emit("join-room", roomId);

    peerConnection.current = new RTCPeerConnection();

    stream.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: event.candidate
        });
      }
    };

    socket.on("user-joined", async () => {

      const offer = await peerConnection.current.createOffer();

      await peerConnection.current.setLocalDescription(offer);

      socket.emit("offer", { roomId, offer });

    });

    socket.on("answer", async (answer) => {
      await peerConnection.current.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      await peerConnection.current.addIceCandidate(candidate);
    });

  };

  socket.on("offer", async (offer) => {

    await peerConnection.current.setRemoteDescription(offer);

    const answer = await peerConnection.current.createAnswer();

    await peerConnection.current.setLocalDescription(answer);

    socket.emit("answer", { roomId, answer });

  });

  return (

    <div>

      <h2>Admin Interview Room</h2>

      <div style={{display:"flex",gap:"40px"}}>

        <div>
          <h4>Admin Camera</h4>
          <video ref={localVideo} autoPlay playsInline muted width="300"/>
        </div>

        <div>
          <h4>Candidate Camera</h4>
          <video ref={remoteVideo} autoPlay playsInline width="300"/>
        </div>

      </div>

    </div>

  );
}