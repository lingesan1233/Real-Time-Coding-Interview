import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import Chat from "../components/Chat";

const socket = io("http://localhost:5000");

export default function CandidateInterviewRoom() {

  const { roomId } = useParams();

  const localVideo = useRef();
  const remoteVideo = useRef();

  const peerConnection = useRef();

  const [code, setCode] = useState("");
  const [task, setTask] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    socket.emit("join-room", roomId);

    startVideo();

    socket.on("task-update", (task) => {
      setTask(task);
    });

    socket.on("code-change", (newCode) => {
      setCode(newCode);
    });

    socket.on("meeting-ended", () => {
      alert("Meeting Ended by Admin");
      window.location.href = "/candidate";
    });

  }, []);

  const startVideo = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    localVideo.current.srcObject = stream;

    peerConnection.current = new RTCPeerConnection();

    stream.getTracks().forEach(track =>
      peerConnection.current.addTrack(track, stream)
    );

    peerConnection.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

  };

  const handleCodeChange = (value) => {

    setCode(value);

    socket.emit("code-change", {
      roomId,
      code: value
    });

  };

  const submitCode = () => {

    socket.emit("submit-code", {
      roomId,
      code,
      candidate: user.name
    });

    alert("Code Submitted");
  };

  return (

    <div style={styles.container}>

      <h2>Candidate Interview Room</h2>

      {/* VIDEO SECTION */}

      <div style={styles.videoSection}>

        <div>

          <h4>Your Camera</h4>

          <video
            ref={localVideo}
            autoPlay
            playsInline
            muted
            width="300"
          />

        </div>

        <div>

          <h4>Admin Camera</h4>

          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            width="300"
          />

        </div>

      </div>

      {/* TASK */}

      <div style={styles.task}>

        <h3>Task</h3>

        <p>{task}</p>

      </div>

      {/* CODE EDITOR */}

      <Editor
        height="400px"
        defaultLanguage="javascript"
        value={code}
        onChange={handleCodeChange}
      />

      <button onClick={submitCode} style={styles.submitBtn}>
        Submit Code
      </button>

      {/* CHAT */}

      <Chat socket={socket} roomId={roomId} />

    </div>
  );
}

const styles = {

  container: {
    padding: "20px"
  },

  videoSection: {
    display: "flex",
    gap: "40px",
    marginBottom: "20px"
  },

  task: {
    background: "#f5f5f5",
    padding: "10px",
    marginBottom: "20px"
  },

  submitBtn: {
    marginTop: "10px",
    padding: "10px 20px",
    cursor: "pointer"
  }

};