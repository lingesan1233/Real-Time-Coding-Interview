import { useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import TaskPanel from "../components/TaskPanel";

function InterviewRoom(){

const {roomId} = useParams();

return(

<div>

<h2>Interview Room</h2>

<VideoCall/>

<TaskPanel/>

<CodeEditor/>

<Chat roomId={roomId}/>

</div>

);

}

export default InterviewRoom;