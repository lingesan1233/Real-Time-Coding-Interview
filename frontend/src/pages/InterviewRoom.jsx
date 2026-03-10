import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import VideoCall from "../components/VideoCall";
import Chat from "../components/Chat";

function InterviewRoom(){

const { roomId } = useParams();

return(

<div>

<h2>Interview Room</h2>

<VideoCall roomId={roomId}/>

<CodeEditor roomId={roomId}/>

<Chat roomId={roomId}/>

</div>

)

}

export default InterviewRoom;