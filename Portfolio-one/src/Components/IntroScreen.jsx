import React from "react";
import { motion } from "framer-motion"; // <-- Add this
import laptop from "../assets/laptop1.png";
import github from "../assets/gitIntro.png";
import tags from "../assets/tags.png";
import profile from "../assets/profileIntro.png";

function IntroScreen() {
  return (
    <div className="relative h-screen w-full bg-zinc-900 overflow-hidden">
      <div className="absolute -translate-x-[50%] flex items-center flex-col -translate-y-[50%] top-[50%] left-[50%]">
        
        {/* Laptop Animation */}
        <motion.img
          src={laptop}
          alt="laptop"
          className="w-[15%]"
          initial={{ y: -300, opacity: 0 }}        // starts from top
          animate={{ y: 0, opacity: 1 }}           // moves to normal position
          transition={{
            duration: 1.7,
            ease: "easeOut"
          }}
        />

        <h1 className="text-xl tracking-wide font-semibold text-[#00f6ff] mt-2">
          Portfolio By Emad
        </h1>

        <div className="flex gap-2 justify-center items-center m-1">
          <img className="w-[6%] h-[6%]" src={github} alt="github" />
          <img className="w-[5.2%] h-[5.2%]" src={tags} alt="tags" />
          <img className="w-[3.7%] ml-3 h-[3.7%]" src={profile} alt="profile" />
        </div>
      </div>
    </div>
  );
}

export default IntroScreen;
