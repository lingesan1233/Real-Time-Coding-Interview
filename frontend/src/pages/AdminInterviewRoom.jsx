import { useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import CodeEditor from "../components/CodeEditor";
import TaskPanel from "../components/TaskPanel";

export default function AdminInterviewRoom(){

const {roomId} = useParams();

return(

<div style={{padding:20}}>

<h2>Admin Interview Room</h2>

<VideoCall roomId={roomId} role="admin"/>

<TaskPanel/>

<CodeEditor room={roomId}/>

</div>

)

}