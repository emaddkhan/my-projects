import React, { useState, useEffect } from "react";
import { IoMdArrowDropdownCircle } from "react-icons/io";

import ColorBarPicker from "./color pickers/ColorBarPicker";
import NavbarFontPicker from "./color pickers/NavbarFontPicker";
import NavBgPicker from "./color pickers/NavBgPicker";
import NavBtnFontPicker from "./color pickers/NavBtnFontPicker";
import BackGroundColorPicker from "./color pickers/BackGroundColorPicker";
import BackgroundFontColorPicker from "./color pickers/BackgroundFontColorPicker";
import { PiCheckFatFill } from "react-icons/pi";

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
  setBackgroundMainColor,
  setBackgroundMainFontColor,
  setBgFontValue,
  bgFontValue,
}) {
  const [showNavTheme, setShowNavTheme] = useState(false);
  const [showMainNav, setShowMainNav] = useState(false);
  const [showNavFont, setShowNavFont] = useState(false);
  const [showNavBtnBg, setShowNavBtnBg] = useState(false);
  const [showNavBtnFont, setShowNavBtnFont] = useState(false);
  const [showBackgroundMain, setShowBackgroundMain] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showBgFontColor, setShowBgFontColor] = useState(false);
  const [showBgFontSize, setShowBgFontSize] = useState(false);
  const [fontVal, setFontVal] = useState(bgFontValue);

  useEffect(() => {
    setFontVal(bgFontValue);
  }, [bgFontValue]);

  const setFontSizeHandler = () => {
    setBgFontValue(fontVal); 
    setShowBgFontSize(false);
    console.log("applied font size:", fontVal, "vw");
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
        onClick={() => setShowMainNav(!showMainNav)}
        className="flex justify-between cursor-pointer items-center"
      >
        <h3 className="text-2xl font-semibold">Navbar:</h3>
        <IoMdArrowDropdownCircle
          className={`text-2xl transition-all duration-300 ${
            showMainNav ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`pl-3 mt-2 transition-all duration-300 overflow-hidden ${
          showMainNav ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={() => setShowNavTheme(!showNavTheme)}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className="font-semibold">Navbar Theme</h4>
          <IoMdArrowDropdownCircle
            className={`text-2xl transition-all duration-300 ${
              showNavTheme ? "rotate-180" : ""
            }`}
          />
        </div>
        {showNavTheme && (
          <ColorBarPicker
            setShowNavTheme={setShowNavTheme}
            setNavColor={setNavColor}
            navColor={navColor}
            showNavTheme={showNavTheme}
          />
        )}
      </div>

      <div
        className={`pl-3 transition-all duration-300 overflow-hidden ${
          showMainNav ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={() => setShowNavFont(!showNavFont)}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className="font-semibold">Navbar Font Color</h4>
          <IoMdArrowDropdownCircle
            className={`text-2xl transition-all duration-300 ${
              showNavFont ? "rotate-180" : ""
            }`}
          />
        </div>
        {showNavFont && (
          <NavbarFontPicker
            setShowNavFont={setShowNavFont}
            setNavFontColor={setNavFontColor}
            showNavFont={showNavFont}
          />
        )}
      </div>

      <div
        className={`pl-3 transition-all duration-300 overflow-hidden ${
          showMainNav ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={() => setShowNavBtnBg(!showNavBtnBg)}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className="font-semibold">Navbar Button Background</h4>
          <IoMdArrowDropdownCircle
            className={`text-2xl transition-all duration-300 ${
              showNavBtnBg ? "rotate-180" : ""
            }`}
          />
        </div>
        {showNavBtnBg && (
          <NavBgPicker
            setNavBtnBgColor={setNavBtnBgColor}
            setShowNavBtnBg={setShowNavBtnBg}
            showNavBtnBg={showNavBtnBg}
          />
        )}

        <div
          onClick={() => setShowNavBtnFont(!showNavBtnFont)}
          className="flex items-center cursor-pointer justify-between mt-2"
        >
          <h4 className="font-semibold">Navbar Button Font Color</h4>
          <IoMdArrowDropdownCircle
            className={`text-2xl transition-all duration-300 ${
              showNavBtnFont ? "rotate-180" : ""
            }`}
          />
        </div>
        {showNavBtnFont && (
          <NavBtnFontPicker
            setShowNavBtnFont={setShowNavBtnFont}
            setNavBtnFontColor={setNavBtnFontColor}
            showNavBtnFont={showNavBtnFont}
          />
        )}
      </div>

      <div
        onClick={() => setShowBackgroundMain(!showBackgroundMain)}
        className="flex justify-between cursor-pointer items-center mt-3"
      >
        <h3 className="text-2xl font-semibold">Background:</h3>
        <IoMdArrowDropdownCircle
          className={`text-2xl transition-all duration-300 ${
            showBackgroundMain ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`pl-3 mt-2 transition-all duration-300 overflow-hidden ${
          showBackgroundMain ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={() => setShowBgPicker(!showBgPicker)}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className="font-semibold">Background Color</h4>
          <IoMdArrowDropdownCircle
            className={`text-2xl transition-all duration-300 ${
              showBgPicker ? "rotate-180" : ""
            }`}
          />
        </div>
        {showBgPicker && (
          <BackGroundColorPicker
            setBackgroundMainColor={setBackgroundMainColor}
            setShowBgPicker={setShowBgPicker}
            showBgPicker={showBgPicker}
          />
        )}
      </div>

      <div
        className={`pl-3 mt-2 transition-all duration-300 overflow-hidden ${
          showBackgroundMain ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={() => setShowBgFontColor(!showBgFontColor)}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className="font-semibold">Background Font Color</h4>
          <IoMdArrowDropdownCircle
            className={`text-2xl transition-all duration-300 ${
              showBgFontColor ? "rotate-180" : ""
            }`}
          />
        </div>
        {showBgFontColor && (
          <BackgroundFontColorPicker
            setBackgroundMainFontColor={setBackgroundMainFontColor}
            showBgFontColor={showBgFontColor}
            setShowBgFontColor={setShowBgFontColor}
          />
        )}
      </div>

      <div
        className={`pl-3 mt-2 transition-all duration-300 overflow-hidden ${
          showBackgroundMain ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={() => setShowBgFontSize(!showBgFontSize)}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className="font-semibold">Font Size</h4>
          <IoMdArrowDropdownCircle
            className={`text-2xl transition-all duration-300 ${
              showBgFontSize ? "rotate-180" : ""
            }`}
          />
        </div>
        {showBgFontSize && (
          <>
            <input
              type="range"
              min={0}
              max={20}
              step={0.5}
              value={fontVal}
              onChange={(e) => setFontVal(parseFloat(e.target.value))}
              className="w-[90%] mx-auto h-3 cursor-pointer"
            />
            <div className="flex justify-end px-8">
              <button
                onClick={setFontSizeHandler}
                className="p-2 rounded-lg hover:bg-green-100 transition"
              >
                <PiCheckFatFill className="text-2xl text-green-600" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SettingPanel;
