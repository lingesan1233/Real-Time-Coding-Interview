import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function CandidateDashboard() {

  const [interviews, setInterviews] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/interview/candidate/${user._id}`
      );

      setInterviews(res.data);

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <div>

      <Navbar />

      <h2>Candidate Dashboard</h2>

      {interviews.length === 0 && (
        <p>No interviews available</p>
      )}

      {interviews.map((interview) => (

        <div
          key={interview._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "15px"
          }}
        >

          <h3>Interview</h3>

          <p><b>Task :</b> {interview.task}</p>

          <p><b>Status :</b> {interview.status}</p>

          {interview.status === "live" && (

            <button
              style={{
                background: "green",
                color: "white",
                padding: "10px",
                border: "none",
                cursor: "pointer"
              }}
              onClick={() => window.location = `/room/${interview.roomId}`}
            >
              Join Live Meeting
            </button>

          )}

        </div>

      ))}

    </div>

  );

}

export default CandidateDashboard;