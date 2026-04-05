import React, { useState, useRef, useEffect } from "react";

function InnerNav() {
  const tabs = ["Today", "This Week", "Popular", "Top Rated"]; // dynamic tabs
  const [activeIndex, setActiveIndex] = useState(0); // Today default active
  const [capsuleStyle, setCapsuleStyle] = useState({ width: 0, left: 0 });
  const tabsRef = useRef([]);

  // Set capsule on first render & every active change
  useEffect(() => {
    if (tabsRef.current[activeIndex]) {
      const tab = tabsRef.current[activeIndex];
      setCapsuleStyle({
        width: tab.offsetWidth,
        left: tab.offsetLeft,
      });
    }
  }, [activeIndex, tabs]);

  return (
    <div className="flex justify-center">
      <div className="relative flex items-center border gap-4 border-[#032541]  rounded-full w-fit">
        {/* Sliding capsule */}
        <div
          className="absolute top-0 bottom-0 bg-[#032541] rounded-full transition-all duration-300"
          style={{ width: capsuleStyle.width, transform: `translateX(${capsuleStyle.left}px)` }}
        ></div>

        {/* Tabs */}
        {tabs.map((tab, index) => (
          <div
            key={index}
            ref={(el) => (tabsRef.current[index] = el)}
            onClick={() => setActiveIndex(index)}
            className={`relative z-10 px-6 py-[.2vw] cursor-pointer text-[.8vw] font-semibold select-none transition-colors duration-300 ${
              activeIndex === index ? "text-white" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InnerNav;