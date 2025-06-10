import React, { useEffect, useState } from "react";

function IntroScreen({ setIsLoading }) {
  const [loadVal, setLoadVal] = useState(0);
  const [exit, setExit] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadVal((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setExit(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 800);
          return prev;
        }
      });
    }, 50);
    return () => clearInterval(interval);
  }, [setIsLoading]);

  return (
    <div
      className={`w-full h-screen bg-[#161618] overflow-hidden transition-all duration-700 ease-in-out fixed top-0 left-0 ${
        exit ? "opacity-0 translate-y-[-100%]" : "opacity-100"
      }`}
    >
      <div
        className="h-2 bg-[#7542ff]"
        style={{ width: `${loadVal}%`, transition: "width 0.1s linear" }}
      ></div>
      <div className="py-1 w-full flex justify-end">
        <h1 className="text-[#42474c] text-[15vw] leading-none items-start ">
          {loadVal}
          <span className="text-[#7542ff]">%</span>
        </h1>
      </div>
    </div>
  );
}

export default IntroScreen;
