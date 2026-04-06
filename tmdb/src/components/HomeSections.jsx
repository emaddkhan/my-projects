import React from "react";
import InnerNav from "./InnerNav";
import HomeMovieDisplay from "./HomeMovieDisplay";
import sectionBg from "../assets/section1.svg";

function HomeSections({
  sectionTitles,
  showSection3Bg,
  setShowSection3Bg,
  activeTab,
  tabs,
  showSectionBg,
  setActiveTab,
  moviesToShow,
  showSection3Color,
}) {
  return (
    <div className="relative py-7 w-full">
      {/* Background Image */}
      {showSection3Bg && (
        <div
          className="absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${showSection3Bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: -2,
          }}
        />
      )}

      {/* Color Overlay */}
      {showSection3Color && (
        <div
          className="absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out"
          style={{
            backgroundColor: "#032541",
            opacity: 0.5, // adjust opacity here
            zIndex: -1,
          }}
        />
      )}

      {/* Section Container */}
      <div
        className="relative z-10 sectionContainer w-[63%] mx-auto h-full"
        style={{
          backgroundImage: showSectionBg ? `url(${sectionBg})` : "transparent",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
        }}
      >
        <div className="sectionUpper flex items-center gap-6">
          <h2 className="text-[1.2vw] font-semibold">{sectionTitles}</h2>
          <InnerNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Movie Cards */}
        <HomeMovieDisplay
          setShowSection3Bg={setShowSection3Bg}
          activeTab={activeTab}
          movies={moviesToShow}
        />
      </div>
    </div>
  );
}

export default HomeSections;