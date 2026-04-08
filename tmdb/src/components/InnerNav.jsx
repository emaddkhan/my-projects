import React, { useEffect, useRef, useState } from "react";

function InnerNav({ tabs,tabColor,activeTab, setActiveTab }) {
  

  const [capsuleStyle, setCapsuleStyle] = useState({ width: 0, left: 0 });
  const tabsRef = useRef([]);

  // Update capsule on activeTab change
  useEffect(() => {
    const index = tabs.findIndex(tab => tab.value === activeTab);
  
    if (tabsRef.current[index]) {
      const tab = tabsRef.current[index];
      setCapsuleStyle({
        width: tab.offsetWidth,
        left: tab.offsetLeft,
      });
    }
  }, [activeTab]);

  return (
    <div className="flex justify-center">
      <div className="relative flex items-center border gap-1 border-[#032541] rounded-full w-fit">
        <div
          className={`absolute top-0 bottom-0  rounded-full transition-all duration-300`}
          style={{ width: capsuleStyle.width, transform: `translateX(${capsuleStyle.left}px)`,backgroundColor:tabColor?"#31DAAD":"#032541" }}
        ></div>

        {tabs.map((tab, index) => (
          <div
            key={index}
            ref={el => (tabsRef.current[index] = el)}
            onClick={() => setActiveTab(tab.value)}
            className={`relative z-10 px-5 py-[.2vw] cursor-pointer text-[.75vw] font-semibold select-none transition-colors duration-300 ${
              activeTab === tab.value ? "text-white" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InnerNav;