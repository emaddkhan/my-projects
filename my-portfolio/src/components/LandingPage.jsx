import React from "react";
import doodle from '../assets/doodles mixed round.png';
import group from '../assets/Group 2373.png';
import shadow from '../assets/Ellipse 3.png'
function LandingPage() {
  return (
    <div className="w-full h-[88.4vh] flex justify-center">
      <div className="w-[90%] h-full flex justify-between items-center bg-brand-blue ">
        <div className="w-[55%] h-[80%]  p-40">
          <h1 className="text-8xl leading-none font-bold text-brand-white font-poppins tracking-tight">
            CREATIVE UI <br />
            <span className="text-brand-cyan"> DEVELOPER</span>
          </h1>
        </div>
        <div className="w-[48%] h-[85%] ">
            <div className="h-[95%] w-[95%] bg-cover flex items-end bg-center" style={{ backgroundImage: `url(${doodle})` }}>
                <div className="absolute top-[50%]">
                    <img src={group} alt="" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
