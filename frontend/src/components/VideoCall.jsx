import {useEffect,useRef} from "react";

function VideoCall(){

const localVideo = useRef();
const remoteVideo = useRef();

useEffect(()=>{

navigator.mediaDevices
.getUserMedia({video:true,audio:true})
.then(stream=>{

localVideo.current.srcObject = stream;

});

},[])

return(

<div>

<video ref={localVideo} autoPlay muted width="300"/>
<video ref={remoteVideo} autoPlay width="300"/>

</div>

)

}

export default VideoCall