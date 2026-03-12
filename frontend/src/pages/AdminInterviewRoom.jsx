peerConnection.current.ontrack = (event) => {

  const track = event.track;
  const stream = new MediaStream([track]);

  if (track.kind === "video") {

    // First remote video → camera
    if (!remoteVideo.current.srcObject) {
      remoteVideo.current.srcObject = stream;
    }
    // Second video → screen share
    else {
      screenVideo.current.srcObject = stream;
      setScreenActive(true);
    }

  }

};