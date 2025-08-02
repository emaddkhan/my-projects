import React from "react";
import NavElem from "./NavElem";

function Navbar() {
  return (
    <div className="py-6 w-full flex items-center justify-center border-b-2 border-brand-grey">
      <div className="w-[90%] flex justify-between items-center">
        <div className="w-[33%] left-0 lineer absolute py-14  border-r-2 border-brand-grey   "></div>
        <div className="w-[15%] text-4xl relative z-1 text-brand-white -tracking-4 font-semibold accordion font-oswald   py-2">
          Emad Khan
        </div>
        <div className="w-[20%] mr-5 nav-container  ">
          <NavElem />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
