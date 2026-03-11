import { useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import CodeEditor from "../components/CodeEditor";
import TaskPanel from "../components/TaskPanel";

export default function CandidateInterviewRoom(){

const {roomId} = useParams();

return(

<div style={{padding:20}}>

<h2>Candidate Interview Room</h2>

<VideoCall roomId={roomId} role="candidate"/>

<TaskPanel/>

<CodeEditor room={roomId}/>

</div>

)

}