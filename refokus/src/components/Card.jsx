import React from "react";
import { GoArrowRight } from "react-icons/go";

function Card({ width, start, para ,hover}) {
  return (
    <div className={` bg-zinc-800 p-5 rounded-xl ${width} ${hover}  min-h-[30rem] flex flex-col justify-between `}>
      <div className="w-full">
        <div className="w-full flex justify-between items-center">
          <h3>heading</h3>
          <GoArrowRight />
        </div>
        <h1 className="text-3xl font-medium mt-10">whatever</h1>
      </div>
      <div className="down w-full ">
        {start && (
          <>
            <h1 className="text-7xl tracking-tight leading-none font-semibold">
              Start a project
            </h1>
            <button className="rounded-full px-5 mt-3 border-[1px] border-zinc-100 py-2">
              Contact us
            </button>
          </>
        ) }
        {
          para &&(
            <p className="text-sm text-zinc-500 font-medium">
          Explore what drives our team.
        </p>
          )
        }
        
      </div>
    </div>
  );
}

export default Card;
