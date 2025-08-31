import React, { useState } from "react";

import { IoMdArrowDropdownCircle } from "react-icons/io";
import ColorBarPicker from "./color pickers/ColorBarPicker";
import NavbarFontPicker from "./color pickers/NavbarFontPicker";
import NavBgPicker from "./color pickers/NavBgPicker";
import NavBtnFontPicker from "./color pickers/NavBtnFontPicker";
import BackGroundColorPicker from "./color pickers/BackGroundColorPicker";

function SettingPanel({
  showSettings,
  navBtnBgColor,
  setNavBtnFontColor,
  navBtnFontColor,
  navColor,
  setNavColor,
  navFontColor,
  setNavBtnBgColor,
  setNavFontColor,
  setBackgroundMainColor
}) {
  const [showNavTheme, setShowNavTheme] = useState(false);
  const [showMainNav, setShowMainNav] = useState(false);
  const [showNavFont, setShowNavFont] = useState(false);
  const [showNavBtnBg, setShowNavBtnBg] = useState(false);
  const [showNavBtnFont, setShowNavBtnFont] = useState(false);
  const [showBackgroundMain, setShowBackgroundMain] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const mainNavbarBtnHandler = () => {
    setShowMainNav(!showMainNav);
  };
  const showNavFontBtnHandler = () => {
    setShowNavFont(!showNavFont);
  };
  const showNavBtnHandler = () => {
    setShowNavTheme(!showNavTheme);
  };
  const showNavBgBtnHandler = () => {
    setShowNavBtnBg(!showNavBtnBg);
  };
  const showNavBTnFontHandler = () => {
    setShowNavBtnFont(!showNavBtnFont);
  };
  const showBackgroundMainHandler = () => {
    setShowBackgroundMain(!showBackgroundMain);
  };
  const showBgPickerHandler = () => {
    setShowBgPicker(!showBgPicker);
  };

  return (
    <div
      className={`absolute w-[25%] 
        ${showSettings ? "max-h-[90%] opacity-100" : "max-h-0 opacity-0"} 
         rounded-2xl top-[10%] z-[6] left-[2%] 
        transition-all duration-500 overflow-hidden p-5`}
      style={{ backgroundColor: navColor }}
    >
      <h1 className="font-semibold text-lg">Theme:</h1>
      <div
        onClick={mainNavbarBtnHandler}
        className="flex justify-between cursor-pointer  items-center"
      >
        <h3 className="text-2xl font-semibold">Navbar:</h3>{" "}
        <span
          className={`text-2xl transition-all duration-300 ${
            showMainNav ? "rotate-180" : ""
          }`}
        >
          <IoMdArrowDropdownCircle />
        </span>
      </div>
      <div
        className={`pl-3 mt-2 ${
          showMainNav ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={showNavBtnHandler}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className=" font-semibold">Navbar Theme</h4>{" "}
          <button>
            <IoMdArrowDropdownCircle
              className={`text-2xl transition-all duration-300 ${
                showNavTheme ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <ColorBarPicker
          setShowNavTheme={setShowNavTheme}
          setNavColor={setNavColor}
          navColor={navColor}
          showNavTheme={showNavTheme}
        />
      </div>
      <div
        className={`pl-3  ${
          showMainNav ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={showNavFontBtnHandler}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className=" font-semibold">Navbar Font Color</h4>{" "}
          <button>
            <IoMdArrowDropdownCircle
              className={`text-2xl transition-all duration-300 ${
                showNavFont ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <NavbarFontPicker
          setShowNavFont={setShowNavFont}
          setNavFontColor={setNavFontColor}
          showNavFont={showNavFont}
        />
      </div>
      <div
        className={`pl-3  ${
          showMainNav ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={showNavBgBtnHandler}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className=" font-semibold">Navbar Button Background</h4>{" "}
          <button>
            <IoMdArrowDropdownCircle
              className={`text-2xl transition-all duration-300 ${
                showNavBtnBg ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <NavBgPicker
          setNavBtnBgColor={setNavBtnBgColor}
          setShowNavBtnBg={setShowNavBtnBg}
          showNavBtnBg={showNavBtnBg}
        />

        <div
          onClick={showNavBTnFontHandler}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className=" font-semibold">Navbar Button Font Color</h4>{" "}
          <button>
            <IoMdArrowDropdownCircle
              className={`text-2xl transition-all duration-300 ${
                showNavBtnFont ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <NavBtnFontPicker
          setShowNavBtnFont={setShowNavBtnFont}
          setNavBtnFontColor={setNavBtnFontColor}
          showNavBtnFont={showNavBtnFont}
        />
      </div>

      {/* backgroung */}

      <div
        onClick={showBackgroundMainHandler}
        className="flex justify-between cursor-pointer items-center"
      >
        <h3 className="text-2xl font-semibold">BackGround:</h3>
        <span
          className={`text-2xl transform transition-transform duration-300 ${
            showBackgroundMain ? "rotate-180" : ""
          }`}
        >
          <IoMdArrowDropdownCircle />
        </span>
      </div>

      <div
        className={`pl-3 mt-2 ${
          showBackgroundMain ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={showBgPickerHandler}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className=" font-semibold">Background color</h4>{" "}
          <button>
            <IoMdArrowDropdownCircle
              className={`text-2xl transition-transform transform duration-300 ${
                showBgPicker ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <BackGroundColorPicker setBackgroundMainColor={setBackgroundMainColor} setShowBgPicker={setShowBgPicker} showBgPicker={showBgPicker}/>
        
      </div>

      
    </div>
  );
}

export default SettingPanel;
