import React, { useState } from "react";
import ColorBarPicker from "./ColorBarPicker";
import { IoMdArrowDropdownCircle } from "react-icons/io";


function SettingPanel({ showSettings,navColor,setNavColor }) {
const [showNavTheme,setShowNavTheme]=useState(false)


const showNavBtnHandler=()=>{
    setShowNavTheme(!showNavTheme)
}
  return (
    <div
      className={`absolute w-[25%] 
        ${showSettings ? "max-h-[60%] opacity-100" : "max-h-0 opacity-0"} 
         rounded-2xl top-[10%] z-[6] left-[2%] 
        transition-all duration-500 overflow-hidden p-5`}
        style={{backgroundColor:navColor}}
    >
      <h1 className="font-semibold text-lg">Theme:</h1>
      <div onClick={showNavBtnHandler}  className="flex items-center cursor-pointer justify-between">
        <h4 className=" font-semibold">Navbar Theme</h4>{" "}
        <button >
            <IoMdArrowDropdownCircle className={`text-2xl transition-all duration-300 ${showNavTheme?"rotate-180":""}`} />
        </button>
      </div>
      <ColorBarPicker setShowNavTheme={setShowNavTheme} setNavColor={setNavColor} navColor={navColor} showNavTheme={showNavTheme} />
    </div>
  );
}

export default SettingPanel;
