import {useEffect,useRef} from "react";

function VideoCall(){

const localVideo = useRef();

useEffect(()=>{

navigator.mediaDevices.getUserMedia({
video:true,
audio:true
})
.then(stream=>{
localVideo.current.srcObject = stream;
});

},[]);

return(

<div>

<h3>Video Call</h3>

<video
ref={localVideo}
autoPlay
muted
width="300"
/>

</div>

)

}

export default VideoCall;