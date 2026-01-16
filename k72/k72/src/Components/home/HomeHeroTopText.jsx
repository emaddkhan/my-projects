import React from "react";
import homeVideo from '../../assets/homeVideo.mp4'
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
            src={homeVideo}
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
