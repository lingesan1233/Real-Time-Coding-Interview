import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io("https://real-time-coding-interview-h6in.onrender.com");

export default function CandidateInterviewRoom() {

  const { roomId } = useParams();

  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerConnection = useRef();

  const [task,setTask] = useState("");
  const [code,setCode] = useState("");

  useEffect(() => {

    startVideo();

    socket.on("receive-task",(task)=>{
      setTask(task);
    });

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

    socket.on("offer", async (offer) => {

      await peerConnection.current.setRemoteDescription(offer);

      const answer = await peerConnection.current.createAnswer();

      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer", { roomId, answer });

    });

    socket.on("answer", async (answer) => {
      await peerConnection.current.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      await peerConnection.current.addIceCandidate(candidate);
    });

  };

  const submitCode = () => {

    socket.emit("submit-code",{
      roomId,
      code
    });

    alert("Answer Submitted");

  };

  const shareScreen = async () => {

    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video:true
    });

    const screenTrack = screenStream.getTracks()[0];

    const sender = peerConnection.current.getSenders().find(
      s => s.track.kind === "video"
    );

    sender.replaceTrack(screenTrack);

  };

  return (

    <div style={{padding:"20px"}}>

      <h2>Candidate Interview Room</h2>

      <div style={{display:"flex",gap:"40px"}}>

        <div>
          <h4>Candidate Camera</h4>
          <video ref={localVideo} autoPlay playsInline muted width="300"/>
        </div>

        <div>
          <h4>Admin Camera</h4>
          <video ref={remoteVideo} autoPlay playsInline width="300"/>
        </div>

      </div>

      <br/>

      <button onClick={shareScreen}>Share Screen</button>

      <hr/>

      <h3>Task</h3>

      <div style={{background:"#eee",padding:"10px"}}>
        {task || "Waiting for admin to assign task"}
      </div>

      <hr/>

      <h3>Code Editor</h3>

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