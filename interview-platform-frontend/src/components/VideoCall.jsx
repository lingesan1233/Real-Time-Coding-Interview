import { useRef,useEffect } from "react";

function VideoCall(){

 const localVideo=useRef();

 useEffect(()=>{

  navigator.mediaDevices
  .getUserMedia({video:true,audio:true})
  .then(stream=>{
   localVideo.current.srcObject=stream;
  });

 },[]);

 return(

  <div>

   <video
   ref={localVideo}
   autoPlay
   playsInline
   width="300"
   />

  </div>

 );

}

export default VideoCall;