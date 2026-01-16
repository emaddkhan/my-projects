import React from "react";
import homeVideo from '../../assets/homeVideo.mp4'


const Videos = () => {
  return (
    <div className="h-full w-full">
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        src={homeVideo}
      ></video>
    </div>
  );
};

export default Videos;
