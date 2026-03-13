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
    
    // Cleanup on unmount
    return () => {
      if (localStream.current) localStream.current.getTracks().forEach(t => t.stop());
      socket.off("receive-submission");
      socket.off("call-ended");
    };
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.current = stream;
      localVideo.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

      peerConnection.current.ontrack = (event) => {
        remoteVideo.current.srcObject = event.streams[0];
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

      socket.on("offer", async (offer) => {
        await peerConnection.current.setRemoteDescription(offer);
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
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

  const endCall = () => {
    if (localStream.current) localStream.current.getTracks().forEach(track => track.stop());
    if (peerConnection.current) peerConnection.current.close();
    socket.emit("end-call", roomId);
    navigate("/admin");
  };

  // Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
  };

  const headerStyle = {
    padding: "1rem 2rem",
    backgroundColor: "#1e293b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #334155"
  };

  const mainGrid = {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    flex: 1,
    overflow: "hidden"
  };

  const sidebarStyle = {
    padding: "1.5rem",
    borderRight: "1px solid #334155",
    backgroundColor: "#0f172a",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  };

  const videoCardStyle = {
    width: "100%",
    borderRadius: "12px",
    backgroundColor: "#1e293b",
    overflow: "hidden",
    position: "relative",
    aspectRatio: "16/9",
    border: "1px solid #334155"
  };

  const badgeStyle = {
    position: "absolute",
    bottom: "8px",
    left: "8px",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "12px"
  };

  const btnSecondary = {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "transparent",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s"
  };

  const btnPrimary = {
    ...btnSecondary,
    backgroundColor: "#3b82f6",
    border: "none",
    fontWeight: "600"
  };

  return (
    <div style={containerStyle}>
      {/* Top Header */}
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></div>
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Interview Session: {roomId}</h2>
        </div>
        <button onClick={endCall} style={{ ...btnPrimary, backgroundColor: "#ef4444" }}>
          End Interview
        </button>
      </header>

      <div style={mainGrid}>
        {/* Left Sidebar: Videos & Controls */}
        <aside style={sidebarStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={videoCardStyle}>
              <video ref={remoteVideo} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={badgeStyle}>Candidate</span>
            </div>
            
            <div style={videoCardStyle}>
              <video ref={localVideo} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={badgeStyle}>Admin (You)</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button onClick={toggleCamera} style={btnSecondary}>
              {cameraOn ? "📷 Off" : "📷 On"}
            </button>
            <button onClick={toggleMic} style={btnSecondary}>
              {micOn ? "🎤 Mute" : "🎤 Unmute"}
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ marginBottom: "0.5rem", color: "#94a3b8" }}>Assign New Task</h4>
            <textarea
              placeholder="Paste the coding challenge here..."
              rows="6"
              style={{
                width: "100%",
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "10px",
                color: "white",
                resize: "none"
              }}
              onChange={(e) => setTask(e.target.value)}
            />
            <button 
              onClick={() => socket.emit("assign-task", { roomId, task })} 
              style={{ ...btnPrimary, width: "100%", marginTop: "10px" }}
            >
              Update Task
            </button>
          </div>
        </aside>

        {/* Right Section: Code Editor */}
        <main style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "flex-end" }}>
            <div>
              <h3 style={{ margin: 0 }}>Candidate's Workspace</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>Real-time code synchronization</p>
            </div>
            <div style={{ fontSize: "12px", color: "#3b82f6", fontWeight: "bold" }}>● LIVE SYNC ACTIVE</div>
          </div>
          
          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #334155", flex: 1 }}>
            <Editor
              height="100%"
              theme="vs-dark"
              defaultLanguage="javascript"
              value={candidateCode}
              options={{
                readOnly: true,
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}