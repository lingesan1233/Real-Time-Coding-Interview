import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io("https://real-time-coding-interview-h6in.onrender.com");

export default function AdminInterviewRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerConnection = useRef();
  const localStream = useRef();

  const [task, setTask] = useState("");
  const [candidateCode, setCandidateCode] = useState("");
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  useEffect(() => {
    startVideo();

    socket.on("receive-submission", (data) => {
      setCandidateCode(data.code);
    });

    socket.on("call-ended", () => {
      alert("Candidate left the interview");
      navigate("/admin");
    });

    return () => {
      socket.off("receive-submission");
      socket.off("call-ended");
      socket.off("user-joined");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { roomId, candidate: event.candidate });
        }
      };

      socket.emit("join-room", roomId);

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
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const toggleCamera = () => {
    const track = localStream.current.getVideoTracks()[0];
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

  const toggleMic = () => {
    const track = localStream.current.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const assignTask = () => {
    socket.emit("assign-task", { roomId, task });
    alert("Task sent successfully!");
  };

  const endCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    socket.emit("end-call", roomId);
    navigate("/admin");
  };

  // --- Styles ---
  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      backgroundColor: "#0f172a",
      color: "#f8fafc",
      fontFamily: "'Inter', sans-serif",
      overflow: "hidden",
    },
    sidebar: {
      width: "320px",
      backgroundColor: "#1e293b",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #334155",
      gap: "20px",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      gap: "20px",
    },
    videoGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    videoWrapper: {
      position: "relative",
      borderRadius: "12px",
      overflow: "hidden",
      backgroundColor: "#000",
      aspectRatio: "16/9",
    },
    videoLabel: {
      position: "absolute",
      bottom: "10px",
      left: "10px",
      background: "rgba(0,0,0,0.6)",
      padding: "4px 12px",
      borderRadius: "4px",
      fontSize: "0.8rem",
    },
    editorContainer: {
      flex: 1,
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #334155",
    },
    button: {
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    primaryBtn: { backgroundColor: "#3b82f6", color: "white" },
    dangerBtn: { backgroundColor: "#ef4444", color: "white" },
    secondaryBtn: { backgroundColor: "#475569", color: "white" },
    textarea: {
      width: "100%",
      backgroundColor: "#0f172a",
      color: "#f8fafc",
      border: "1px solid #334155",
      borderRadius: "8px",
      padding: "12px",
      resize: "none",
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Controls */}
      <aside style={styles.sidebar}>
        <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Interview Admin</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Room ID: {roomId}</p>
        
        <hr style={{ borderColor: "#334155", width: "100%" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button style={{ ...styles.button, ...styles.secondaryBtn }} onClick={toggleCamera}>
            {cameraOn ? "📷 Disable Camera" : "📷 Enable Camera"}
          </button>
          <button style={{ ...styles.button, ...styles.secondaryBtn }} onClick={toggleMic}>
            {micOn ? "🎤 Mute Mic" : "🎤 Unmute Mic"}
          </button>
          <button style={{ ...styles.button, ...styles.dangerBtn, marginTop: "10px" }} onClick={endCall}>
            End Interview
          </button>
        </div>

        <div style={{ marginTop: "auto" }}>
          <h4 style={{ marginBottom: "8px" }}>Assign New Task</h4>
          <textarea
            rows="6"
            placeholder="Type task instructions here..."
            style={styles.textarea}
            onChange={(e) => setTask(e.target.value)}
          />
          <button 
            style={{ ...styles.button, ...styles.primaryBtn, width: "100%", marginTop: "10px" }} 
            onClick={assignTask}
          >
            Send to Candidate
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main style={styles.mainContent}>
        <div style={styles.videoGrid}>
          <div style={styles.videoWrapper}>
            <video ref={localVideo} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={styles.videoLabel}>You (Admin)</span>
          </div>
          <div style={styles.videoWrapper}>
            <video ref={remoteVideo} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={styles.videoLabel}>Candidate</span>
          </div>
        </div>

        <div style={styles.editorContainer}>
          <div style={{ padding: "10px 20px", background: "#1e293b", borderBottom: "1px solid #334155", fontSize: "0.9rem" }}>
            Live Code Monitor
          </div>
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="javascript"
            value={candidateCode}
            options={{ readOnly: true, fontSize: 14, minimap: { enabled: false } }}
          />
        </div>
      </main>
    </div>
  );
}