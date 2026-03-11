import { useState,useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard(){

  const nav = useNavigate();

  const [candidates,setCandidates] = useState([]);

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");



  /* Load Candidates */

  useEffect(()=>{

    fetchCandidates();

  },[])



  const fetchCandidates = async ()=>{

    const res = await API.get("/admin/candidates");

    setCandidates(res.data);

  }



  /* Create Candidate */

  const createCandidate = async ()=>{

    await API.post("/admin/create-candidate",{
      name,
      email,
      password
    });

    alert("Candidate Created");

    fetchCandidates();

  }



  /* Create Interview */

  const createInterview = async (candidateId)=>{

    const res = await API.post("/admin/create-interview",{
      candidateId
    });

    nav(`/interview/${res.data.roomId}`);

  }



  return(

    <div style={{padding:30}}>

      <h2>Admin Dashboard</h2>


      <h3>Create Candidate</h3>

      <input
        placeholder="Name"
        onChange={e=>setName(e.target.value)}
      />

      <br/>

      <input
        placeholder="Email"
        onChange={e=>setEmail(e.target.value)}
      />

      <br/>

      <input
        placeholder="Password"
        type="password"
        onChange={e=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={createCandidate}>
        Create Candidate
      </button>


      <hr/>

      <h3>All Candidates</h3>


      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Create Interview</th>
          </tr>

        </thead>

        <tbody>

          {candidates.map((c)=>(
            
            <tr key={c._id}>

              <td>{c.name}</td>

              <td>{c.email}</td>

              <td>

                <button
                  onClick={()=>createInterview(c._id)}
                >
                  Start Interview
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>


    </div>

  )

}