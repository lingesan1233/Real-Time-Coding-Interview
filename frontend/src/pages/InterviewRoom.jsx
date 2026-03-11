import { useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import CodeEditor from "../components/CodeEditor";
import TaskPanel from "../components/TaskPanel";

export default function InterviewRoom(){

  const {roomId} = useParams();

  return(

    <div style={{padding:20}}>

      <h2>Live Interview Room</h2>

      <VideoCall room={roomId}/>

      <TaskPanel/>

      <CodeEditor room={roomId}/>

    </div>

  )

}