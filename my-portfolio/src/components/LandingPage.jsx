import React, { useState } from "react";
import doodle from "../assets/doodles mixed round.png";
import group from "../assets/Group 2373.png";
import arrow from "../assets/download.png";
import vectorArrow from "../assets/Vector 187.png";
import downVector from "../assets/Group 2347.png";

function LandingPage({ sectionRefs }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [direction, setDirection] = useState("down");
  const [arrowVal, setArrowVal] = useState(750); // Start at 750
  const [stepStack, setStepStack] = useState([]);

  const scrollToSection = (index) => {
    if (sectionRefs[index]?.current) {
      sectionRefs[index].current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const arrowHandler = () => {
    let updated = arrowVal;
    let nextIndex = sectionIndex;

    if (direction === "down") {
      let step = (arrowVal === 1600 || arrowVal === 2550) ? 950 : 850;
      updated = arrowVal + step;

      if (sectionIndex < sectionRefs.length - 1) {
        nextIndex = sectionIndex + 1;
        setSectionIndex(nextIndex);
        scrollToSection(nextIndex);
      }

      setStepStack((prev) => [...prev, step]);
      if (updated >= 3500) {
        setDirection("up");
      }
    } else {
      // direction === "up"
      if (stepStack.length === 0) return;
      const lastStep = stepStack[stepStack.length - 1];
      updated = arrowVal - lastStep;

      if (sectionIndex > 0) {
        nextIndex = sectionIndex - 1;
        setSectionIndex(nextIndex);
        scrollToSection(nextIndex);
      }

      setStepStack((prev) => prev.slice(0, -1));
      if (updated <= 750) {
        setDirection("down");
      }
    }

    setArrowVal(updated);
  };

  return (
    <div className="w-full h-[88.4vh] flex justify-center border-b-2 border-brand-grey">
      <div className="w-[90%] h-full flex justify-between items-center bg-brand-blue ">
        <div className="absolute left-[8%]">
          <img src={vectorArrow} alt="" />
        </div>
        <div className="w-[33%] lineer absolute left-[0] h-[88.4vh] border-r-2 border-brand-grey "></div>

        <div className="w-[55%] relative z-1 h-[80%] p-40">
          <h1 className="text-8xl leading-none font-bold text-brand-white font-poppins tracking-tight">
            CREATIVE UI <br />
            <span className="text-brand-cyan"> DEVELOPER</span>
          </h1>
          <div className="flex gap-8 mt-8">
            <button className="px-7 py-3 text-md bg-brand-cyan rounded-full text-brand-white font-poppins font-semibold">
              Hire me
            </button>

            <button className="flex gap-4 justify-center items-center px-7 py-3 bg-brand-grey rounded-full text-brand-white font-poppins font-semibold">
              Download cv
              <span>
                <img src={arrow} alt="" />
              </span>
            </button>
          </div>
        </div>

        <div className="w-[48%] h-[85%]">
          <div
            className="h-[95%] w-[95%] bg-cover flex items-end bg-center"
            style={{ backgroundImage: `url(${doodle})` }}
          >
            <div className="absolute top-[50%]">
              <img src={group} alt="" />
            </div>
          </div>
        </div>

        {/* Arrow Button */}
        <button
          onClick={arrowHandler}
          className={`absolute py-8 left-[30.5%] bg-brand-grey px-9 z-10 cursor-pointer transition-all outline-none duration-300 ${
            direction === "up" ? "rotate-180" : ""
          }`}
          style={{ top: `${arrowVal}px` }}
        >
          <img src={downVector} alt="" />
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
