import { motion } from "framer-motion";
import React from "react";
import { GoArrowRight } from "react-icons/go";
function Card({ width, start, para ,hover=false}) {
  return (
    <motion.div whileHover={hover?{backgroundColor:"#7443ff",padding:"25px"}:{padding:"25px"}} className={` cursor-pointer select-none bg-zinc-800 p-5 rounded-xl ${width}   min-h-[30rem] flex flex-col justify-between `}>
      <div className="w-full">
        <div className="w-full flex justify-between items-center">
          <h3>{para?"Up Next: Culture":"Get In Touch"}</h3>
          <GoArrowRight />
        </div>
        <h1  className={`text-3xl font-medium mt-10 ${
            para ? "w-full" : "w-[35%]"
          }`}>{para?"Who we are":"Let's get to it together."}</h1>
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
    </motion.div>
  );
}

export default Card;
