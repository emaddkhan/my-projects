import React from "react";
import InnerNav from "./InnerNav";
import TrailorMovieCard from "./TrailorMovieCard";

function TrailorSectionDisplay({setShowSection3Bg, tabs, moviesToShow, activeTab, setActiveTab }) {
  return (
    <div className="w-[63%] h-full mx-auto ">
      <div className="flex  items-center gap-6 pb-8">
        <h2 className="text-[1.2vw] font-semibold text-white">
          Latest Trailers
        </h2>
        <InnerNav
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="flex items-center gap-5 overflow-auto">
        {moviesToShow.map((movie) => (
          <TrailorMovieCard setShowSection3Bg={setShowSection3Bg} movie={movie} key={movie.id} />
        ))}
      
      </div>
    </div>
  );
}

export default TrailorSectionDisplay;
