import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  createCandidate,
  createInterview,
  getAllInterviews
} from "../services/api";

function AdminDashboard() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [candidateId, setCandidateId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [task, setTask] = useState("");

  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    loadInterviews();
  }, []);


  const loadInterviews = async () => {

    try {

      const res = await getAllInterviews();
      setInterviews(res.data);

    } catch (err) {
      console.log(err);
    }

  };


  const handleCreateCandidate = async () => {

    try {

      await createCandidate({
        name,
        email,
        password
      });

      alert("Candidate created successfully");

      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {

      alert("Error creating candidate");

    }

  };


  const handleCreateInterview = async () => {

    try {

      await createInterview({
        candidateId,
        candidateName,
        task
      });

      alert("Interview created successfully");

      setCandidateId("");
      setCandidateName("");
      setTask("");

      loadInterviews();

    } catch (err) {

      alert("Error creating interview");

    }

  };


  return (

    <div>

      <Navbar />

      <h2 style={{ textAlign: "center" }}>Admin Dashboard</h2>


      <div style={{ margin: "20px" }}>

        <h3>Create Candidate</h3>

        <input
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Candidate Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={handleCreateCandidate}>
          Create Candidate
        </button>

      </div>


      <div style={{ margin: "20px" }}>

        <h3>Create Interview</h3>

        <input
          placeholder="Candidate ID"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Coding Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <br /><br />

        <button onClick={handleCreateInterview}>
          Create Interview
        </button>

      </div>


      <div style={{ margin: "20px" }}>

        <h3>All Interviews</h3>

        {interviews.map((interview) => (

          <div
            key={interview._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px"
            }}
          >

            <p><b>Candidate:</b> {interview.candidateName}</p>

            <p><b>Task:</b> {interview.task}</p>

            <p><b>Status:</b> {interview.status}</p>

            <button
              onClick={() => window.location = `/room/${interview.roomId}`}
            >
              Join Interview
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default AdminDashboard;