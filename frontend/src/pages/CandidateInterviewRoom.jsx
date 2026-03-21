import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

// Assuming these icons are available via Lucide or similar, 
// but I'll use text labels for compatibility.
const socket = io("https://real-time-coding-interview-h6in.onrender.com");

export default function CandidateInterviewRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const localVideo = useRef();
    const remoteVideo = useRef();
    const peerConnection = useRef();
    const localStream = useRef();

    const [task, setTask] = useState("");
    const [code, setCode] = useState("// Write your solution here...");
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);

    useEffect(() => {
        startVideo();

        socket.on("receive-task", (task) => setTask(task));
        socket.on("call-ended", () => {
            alert("Admin ended the interview");
            cleanupCall();
            navigate("/candidate");
        });

        return () => {
            socket.off("receive-task");
            socket.off("call-ended");
        };
    }, []);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.current = stream;
            if (localVideo.current) localVideo.current.srcObject = stream;

            peerConnection.current = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
            });

            stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

            peerConnection.current.ontrack = (event) => {
                if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0];
            };

            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", { roomId, candidate: event.candidate });
                }
            };

            socket.emit("join-room", roomId);

            socket.on("offer", async (offer) => {
                await peerConnection.current.setRemoteDescription(offer);
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                socket.emit("answer", { roomId, answer });
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

    const submitCode = () => {
        socket.emit("submit-code", { roomId, code });
        alert("Code submitted successfully!");
    };

    const cleanupCall = () => {
        if (localStream.current) localStream.current.getTracks().forEach(track => track.stop());
        if (peerConnection.current) peerConnection.current.close();
    };

    const endCall = () => {
        if (window.confirm("Are you sure you want to leave the interview?")) {
            cleanupCall();
            socket.emit("end-call", roomId);
            navigate("/candidate");
        }
    };

    // --- Styled Components (Inline for portability) ---
    const styles = {
        container: {
            height: "100vh",
            display: "grid",
            gridTemplateColumns: "300px 1fr 300px",
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            fontFamily: "Inter, system-ui, sans-serif",
            overflow: "hidden"
        },
        sidebar: {
            padding: "20px",
            borderRight: "1px solid #334155",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
        },
        editorContainer: {
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#1e293b"
        },
        videoSidebar: {
            padding: "20px",
            borderLeft: "1px solid #334155",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            overflowY: "auto"
        },
        videoWrapper: {
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#334155",
            position: "relative",
            aspectRatio: "4/3"
        },
        videoLabel: {
            position: "absolute",
            bottom: "8px",
            left: "8px",
            background: "rgba(0,0,0,0.6)",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px"
        },
        controls: {
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "15px",
            background: "#1e293b",
            borderTop: "1px solid #334155"
        },
        btn: {
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.2s"
        },
        primaryBtn: { backgroundColor: "#3b82f6", color: "white" },
        dangerBtn: { backgroundColor: "#ef4444", color: "white" },
        secondaryBtn: { backgroundColor: "#475569", color: "white" }
    };

    return (
        <div style={styles.container}>
            {/* Left Column: Task Info */}
            <div style={styles.sidebar}>
                <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Interview Room</h2>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Room ID: {roomId}</div>
                <hr style={{ border: "0.5px solid #334155", width: "100%" }} />
                <h4 style={{ marginBottom: "8px" }}>Instruction</h4>
                <div style={{ 
                    background: "#1e293b", 
                    padding: "15px", 
                    borderRadius: "8px", 
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    border: "1px solid #334155"
                }}>
                    {task || "Waiting for the interviewer to provide a task..."}
                </div>
            </div>

            {/* Middle Column: Editor */}
            <div style={styles.editorContainer}>
                <div style={{ padding: "10px 20px", background: "#0f172a", fontSize: "0.9rem", color: "#94a3b8" }}>
                    index.js
                </div>
                <Editor
                    height="100%"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(v) => setCode(v)}
                    options={{ fontSize: 14, minimap: { enabled: false } }}
                />
                <div style={styles.controls}>
                    <button style={{ ...styles.btn, ...styles.primaryBtn }} onClick={submitCode}>
                        Submit Solution
                    </button>
                    <button style={{ ...styles.btn, ...styles.dangerBtn }} onClick={endCall}>
                        Leave Interview
                    </button>
                </div>
            </div>

            {/* Right Column: Video Feeds */}
            <div style={styles.videoSidebar}>
                <div>
                    <div style={styles.videoWrapper}>
                        <video ref={remoteVideo} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <span style={styles.videoLabel}>Interviewer</span>
                    </div>
                </div>
                <div>
                    <div style={styles.videoWrapper}>
                        <video ref={localVideo} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <span style={styles.videoLabel}>You</span>
                    </div>
                </div>

                <div style={{ marginTop: "auto", display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button 
                        onClick={toggleCamera} 
                        style={{ ...styles.btn, ...styles.secondaryBtn, backgroundColor: cameraOn ? "#475569" : "#ef4444" }}
                    >
                        {cameraOn ? "Cam On" : "Cam Off"}
                    </button>
                    <button 
                        onClick={toggleMic} 
                        style={{ ...styles.btn, ...styles.secondaryBtn, backgroundColor: micOn ? "#475569" : "#ef4444" }}
                    >
                        {micOn ? "Mic On" : "Mic Off"}
                    </button>
                </div>
            </div>
        </div>
    );
}