import React, { forwardRef } from "react";
import man2 from "../assets/Group 2375.png";
import doodle2 from "../assets/doodle items.png";
import music from "../assets/Vector 141.png"
import bulb from "../assets/lightbulb.png"
import arrow2 from "../assets/Vector 186.png"

const AboutMe = forwardRef((props,ref)=> {
  return (
    <div ref={ref} className="w-full h-screen border-b-2 border-brand-grey justify-center flex bg-brand-blue">
      <div className="w-[90%]  h-full flex items-center justify-between">
        <div className="w-[28%] lineer absolute  h-screen border-r-2 border-brand-grey "></div>
        <div className="left w-[40%] relative z-1 h-full flex items-center  ">
          <div className="ml-[20%]">
            <h1 className="font-poppins text-6xl font-bold tracking-tight text-brand-white">
              About <span className="text-brand-cyan">me</span>
            </h1>
            <p className="w-[73%] mt-4 text-brand-white text-[2vh] font-medium font-poppins opacity-70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Curabitur tempus urna at turpis condimentum
              lobortis...
              <span className="opacity-100 text-brand-cyan cursor-pointer">
                Read more
              </span>
            </p>
          </div>
          <img src={music} className="absolute top-[20%] left-[20%]" alt="" />
          <img src={bulb} className="absolute top-[33%] left-[68%]" alt="" />
          <img src={arrow2} className="absolute top-[74%] left-[48%]" alt="" />
        </div>
        <div className="w-[60%] relative h-full flex items-center justify-center  ">
          <div className="mr-10">
            <img src={doodle2} alt="" />
          </div>
          <img className="absolute top-[47%] left-[25%]" src={man2} alt="" />
        </div>
      </div>
    </div>
  );
})

export default AboutMe;
