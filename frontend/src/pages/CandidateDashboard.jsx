import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CandidateDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {

    try {

      const res = await api.get(`/interview/candidate/${user._id}`);

      setInterviews(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <div style={styles.container}>

      <h1>Candidate Dashboard</h1>

      {/* Candidate Profile */}

      <div style={styles.card}>

        <h2>My Profile</h2>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> Candidate</p>

      </div>

      {/* Interview List */}

      <div style={styles.card}>

        <h2>My Interviews</h2>

        {interviews.length === 0 && (
          <p>No interviews scheduled yet</p>
        )}

        {interviews.map((interview) => (

          <div key={interview.roomId} style={styles.interviewRow}>

            <div>

              <p><b>Interview Room:</b> {interview.roomId}</p>

              <p>
                <b>Status:</b> {interview.status || "Scheduled"}
              </p>

              <p>
                <b>Task Preview:</b> {interview.task?.substring(0,80)}...
              </p>

            </div>

            <button
              onClick={() =>
                navigate(`/candidate-room/${interview.roomId}`)
              }
              style={styles.joinBtn}
            >
              Join Now
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

const styles = {

  container: {
    padding: "30px"
  },

  card: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "25px",
    background: "#fafafa"
  },

  interviewRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    padding: "15px 0"
  },

  joinBtn: {
    padding: "8px 18px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }

};