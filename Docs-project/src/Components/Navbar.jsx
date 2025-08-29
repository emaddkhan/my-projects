import React from "react";
import { IoSettings } from "react-icons/io5";

function Navbar({ addBtnHandler, navColor,showSettings, settingBtnHandler }) {
  return (
    <div className="py-4 flex justify-between items-center px-12 rounded-bl-xl rounded-br-xl bg-zinc-100 w-full" style={{backgroundColor:navColor}}>
      <button onClick={settingBtnHandler}>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {" "}
          <span >
            <IoSettings className={`text-2xl ${showSettings?"rotate-90":""} transition-all duration-300`} />
          </span>{" "}
          Settings
        </h3>
      </button>
      <h5 className="text-xl font-semibold">Documents</h5>
      <button
        onClick={addBtnHandler}
        className="px-12 py-3 bg-green-500 rounded-full font-semibold text-white"
      >
        Add
      </button>
    </div>
  );
}

export default Navbar;
