import React, { useState, useEffect } from "react";
import { IoMdArrowDropdownCircle } from "react-icons/io";

import ColorBarPicker from "./color pickers/ColorBarPicker";
import NavbarFontPicker from "./color pickers/NavbarFontPicker";
import NavBgPicker from "./color pickers/NavBgPicker";
import NavBtnFontPicker from "./color pickers/NavBtnFontPicker";
import BackGroundColorPicker from "./color pickers/BackGroundColorPicker";
import BackgroundFontColorPicker from "./color pickers/BackgroundFontColorPicker";
import { PiCheckFatFill } from "react-icons/pi";
import { div } from "framer-motion/client";

function getContrastColor(hex) {
  if (!hex) return "#000000";

  // normalize input (#abc → #aabbcc)
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }

  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // convert sRGB → linear RGB
  const toLinear = (c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);

  // relative luminance (0–1)
  const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

  // contrast ratios against white & black
  const contrastWhite = (1.05) / (L + 0.05);
  const contrastBlack = (L + 0.05) / 0.05;

  // return whichever gives better contrast
  return contrastBlack > contrastWhite ? "#000000" : "#ffffff";
}





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
  setFontFamily,
  dragging,
  setDragging
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
  const [showFontStyle, setShowFontStyle] = useState(false);
  const [activeFont, setActiveFont] = useState("");

  useEffect(() => {
    setFontVal(bgFontValue);
  }, [bgFontValue]);

  const setFontSizeHandler = () => {
    setBgFontValue(fontVal);
    setShowBgFontSize(false);
    console.log("applied font size:", fontVal, "vw");
  };
  const buttonOneFontHandler = () => {
    setFontFamily("Arial, Helvetica, sans-serif");
    setActiveFont("Arial, Helvetica, sans-serif");
  };
  const buttonTwoFontHandler = () => {
    setFontFamily("Times New Roman, Times, serif");
    setActiveFont("Times New Roman, Times, serif");
  };
  const buttonThreeFontHandler = () => {
    setFontFamily("Courier New, Courier, monospace");
    setActiveFont("Courier New, Courier, monospace");
  };
  const buttonFourFontHandler = () => {
    setFontFamily("Comic Sans MS, cursive, sans-serif");
    setActiveFont("Comic Sans MS, cursive, sans-serif");
  };

  return (
    <div
      className={`absolute w-[25%] 
        ${showSettings ? "max-h-[90%] opacity-100" : "max-h-0 opacity-0"} 
        rounded-2xl top-[10%] z-[6] left-[2%] 
        transition-all duration-500 overflow-y-auto p-5`}
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
          <div className="px-5">
            <input
              type="range"
              min={0}
              max={20}
              step={0.5}
              value={fontVal}
              onChange={(e) => setFontVal(parseFloat(e.target.value))}
              className="w-full h-4 mt-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: "black",
                color: "white",
              }}
            />
            <div className="flex justify-end ">
              <button
                onClick={setFontSizeHandler}
                className="p-2 rounded-lg hover:bg-green-100 transition"
              >
                <PiCheckFatFill className="text-2xl text-green-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`pl-3 mt-2 transition-all duration-300 overflow-hidden ${
          showBackgroundMain ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          onClick={() => setShowFontStyle(!showFontStyle)}
          className="flex items-center cursor-pointer justify-between"
        >
          <h4 className="font-semibold">Font Style</h4>
          <IoMdArrowDropdownCircle
            className={`text-2xl transition-all duration-300 ${
              showFontStyle ? "rotate-180" : ""
            }`}
          />
        </div>
        {showFontStyle && (
          <div className="w-full  px-5 h-16 flex items-center justify-between">
            <button
              onClick={buttonOneFontHandler}
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                backgroundColor:
                  activeFont === "Arial, Helvetica, sans-serif"
                    ? "black"
                    : "white",
                color:
                  activeFont === "Arial, Helvetica, sans-serif"
                    ? "white"
                    : "black",
              }}
              className="text-xl px-3 py-1 rounded-full"
            >
              Docs.
            </button>
            <button
              onClick={buttonTwoFontHandler}
              style={{ fontFamily: "Times New Roman, Times, serif" ,
                backgroundColor:
                  activeFont === "Times New Roman, Times, serif"
                    ? "black"
                    : "white",
                color:
                  activeFont === "Times New Roman, Times, serif"
                    ? "white"
                    : "black",
              }}
              className="text-xl px-3 py-1 rounded-full"
            >
              Docs.
            </button>
            <button
              onClick={buttonThreeFontHandler}
              style={{ fontFamily: "Courier New, Courier, monospace" ,
                backgroundColor:
                  activeFont === "Courier New, Courier, monospace"
                    ? "black"
                    : "white",
                color:
                  activeFont === "Courier New, Courier, monospace"
                    ? "white"
                    : "black",
              }}
              className="text-xl font-semibold px-3 py-1 rounded-full"
            >
              Docs.
            </button>
            <button
              onClick={buttonFourFontHandler}
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif",
                backgroundColor:
                  activeFont === "Comic Sans MS, cursive, sans-serif"
                    ? "black"
                    : "white",
                color:
                  activeFont === "Comic Sans MS, cursive, sans-serif"
                    ? "white"
                    : "black",
               }}
              className="text-xl px-3 py-1 rounded-full"
            >
              Docs.
            </button>
          </div>
        )}
      </div>


      <div
        onClick={() => setShowBackgroundMain(!showBackgroundMain)}
        className="flex justify-between cursor-pointer items-center mt-2"
      >
        <h3 className="text-2xl font-semibold">Dragging</h3>
        <label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={dragging}
    onChange={() => setDragging(!dragging)}
    className="sr-only peer"
  />

  {/* dynamic bg + contrast */}
  <div
    className="w-12 h-6 rounded-full transition-colors"
    style={{
      backgroundColor: dragging
        ? getContrastColor(navColor) // contrast color
        : "#d1d5db" // gray-300 when off
    }}
  ></div>

  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6"></div>
</label>

      </div>

    </div>
  );
}

export default SettingPanel;
