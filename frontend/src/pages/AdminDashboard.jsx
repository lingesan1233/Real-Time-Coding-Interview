import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [task, setTask] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    const res = await api.get("/admin/candidates");
    setCandidates(res.data);
  };

  const createCandidate = async () => {

    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    await api.post("/admin/create-candidate", {
      name,
      email,
      password
    });

    alert("Candidate Created");

    setName("");
    setEmail("");
    setPassword("");

    loadCandidates();
  };

  const createInterview = async () => {

    if (!selectedCandidate || !task) {
      alert("Select candidate and task");
      return;
    }

    const res = await api.post("/interview/create", {
      candidateId: selectedCandidate,
      task
    });

    alert("Interview Created");

    setInterviews([...interviews, res.data]);
  };

  return (
    <div style={styles.container}>

      <h1>Admin Dashboard</h1>

      {/* CREATE CANDIDATE */}

      <div style={styles.card}>

        <h2>Create Candidate</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={createCandidate}>
          Create Candidate
        </button>

      </div>

      {/* CREATE INTERVIEW */}

      <div style={styles.card}>

        <h2>Create Interview</h2>

        <select
          onChange={(e) => setSelectedCandidate(e.target.value)}
        >

          <option>Select Candidate</option>

          {candidates.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}

        </select>

        <textarea
          placeholder="Enter Task / Question"
          onChange={(e) => setTask(e.target.value)}
        />

        <button onClick={createInterview}>
          Create Interview
        </button>

      </div>

      {/* CANDIDATE LIST */}

      <div style={styles.card}>

        <h2>Candidate List</h2>

        {candidates.map((c) => (

          <div key={c._id} style={styles.row}>

            <div>

              <b>{c.name}</b> <br />
              {c.email}

            </div>

          </div>

        ))}

      </div>

      {/* INTERVIEW LIST */}

      <div style={styles.card}>

        <h2>Scheduled Interviews</h2>

        {interviews.map((i) => (

          <div key={i.roomId} style={styles.row}>

            <div>

              <b>Room:</b> {i.roomId}

              <p>{i.task}</p>

            </div>

            <button
              onClick={() =>
                navigate(`/admin-room/${i.roomId}`)
              }
            >
              Start Interview
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
    marginBottom: "30px",
    borderRadius: "6px",
    background: "#fafafa"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    padding: "10px",
    borderBottom: "1px solid #eee"
  }

};