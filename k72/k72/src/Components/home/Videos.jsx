import React from "react";

const Videos = () => {
  return (
    <div className="h-full w-full">
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        src="https://download-video-ak.vimeocdn.com/v3-1/playback/36bc59b8-6671-4358-abc2-15555fc6ae59/69496b2d?__token__=st=1766468577~exp=1766472177~acl=%2Fv3-1%2Fplayback%2F36bc59b8-6671-4358-abc2-15555fc6ae59%2F69496b2d%2A~hmac=cb16ea818debffbdb7f84c0f9a1d95d94dc5d106fb7edc81caa4048706d44fac&r=dXMtZWFzdDE%3D"
      ></video>
    </div>
  );
};

export default Videos;
