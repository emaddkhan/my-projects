import React, { forwardRef } from "react";
import doodle3 from "../assets/Projects Page.png";
import blog1 from "../assets/blog1.png";
import blog2 from "../assets/blog2.png"
import blog3 from "../assets/blog3.png"

const Work=forwardRef((props,ref)=> {
  return (
    <div ref={ref} className="w-full h-screen bg-brand-blue">
      <div
        className="h-full w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${doodle3})` }}
      >
        <div className="h-[55%] px-10  w-[90%]">
          <h1 className="font-poppins text-brand-white text-6xl font-bold">
            My recent <span className="text-brand-cyan">works</span>
          </h1>
          <div className="flex gap-5   mt-7 ">
            {["All", "UI", "UX", "WEB DESIGN"].map((item,index) => {
              return (
                
                <a key={index} className={`font-poppins text-brand-white rounded-full font-bold text-[1.7vh] px-8 py-3 ${index===0 ? "bg-brand-cyan":"bg-brand-grey"}`}>
                  {item}
                </a>
              );
            })}
          </div>
          <div className="flex mt-12 gap-8   justify-center items-center">
            {[blog1,blog2,blog3].map((item,i)=>{
              return(
                <div className="p-12 bg-[rgba(217,217,217,0.1)] cursor-pointer select-none rounded-3xl">
              <img src={item} alt="" />
            </div>
              )
            })}
            
          </div>
        </div>
      </div>
    </div>
  );
})

export default Work;
