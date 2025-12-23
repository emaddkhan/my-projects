import React from "react";

function HomeHeroTopText() {
  return (
    <div className="font-[font1] text-white pt-5 text-center">
      <div className="text-[9.5vw] leading-[8vw] uppercase">
        The spark for
      </div>

      <div className="text-[9.5vw] flex justify-center items-center gap-[1vw] leading-[8vw] uppercase">
        <span>all</span>

        <div className="w-[17vw] flex mb-5 h-[7vw] overflow-hidden rounded-full">
          <video
            className="w-full rounded-full h-full object-cover"
            loop
            muted
            autoPlay
            
            src="https://download-video-ak.vimeocdn.com/v3-1/playback/36bc59b8-6671-4358-abc2-15555fc6ae59/69496b2d?__token__=st=1766468577~exp=1766472177~acl=%2Fv3-1%2Fplayback%2F36bc59b8-6671-4358-abc2-15555fc6ae59%2F69496b2d%2A~hmac=cb16ea818debffbdb7f84c0f9a1d95d94dc5d106fb7edc81caa4048706d44fac&r=dXMtZWFzdDE%3D"
          />
        </div>

        <span>things</span>
      </div>

      <div className="text-[9.5vw] leading-[8vw] uppercase">
        creative
      </div>
    </div>
  );
}

export default HomeHeroTopText;
