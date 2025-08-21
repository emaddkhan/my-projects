import React from "react";
import movie from "../assets/frame2.png";
import wheather from "../assets/frame-3.png";
import bdh from "../assets/Frame4.png";
import database from "../assets/frame5.png";
import sab from "../assets/frame6.png";
import movie2 from "../assets/Frame 1.png";
import "../css/work.css";

function Work() {
  const items = [
    { img: movie, name: "Movie Web App" },
    { img: wheather, name: "Weather Web App" },
    { img: bdh, name: "BDH Website" },
    { img: database, name: "Mortuary Database Web App" },
    { img: sab, name: "SAB Website" },
    { img: movie2, name: "Movie Web App" },
  ];

  return (
    <div id="work" className="w-full work h-screen">
      <div className="w-[90%] workContainer mx-auto py-5 px-10 h-full">
        <div className="w-full flex flex-col justify-center workContainer2 h-full">
          <h3 className="text-3xl mt-3 workHeading font-bold text-white">
            My Projects
          </h3>

          <div className="relative w-full workinner h-[50%] bg-brand-navGrey px-4 overflow-hidden mt-7 rounded-2xl">
            <h3 className="text-white workContHeading font-semibold py-5 text-2xl mt-2">
              Development Projects
            </h3>

            {/* left + right shadow fades */}
            <div className="absolute tileShadows top-0 left-0 w-6 opacity-5 h-full z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute tileShadows top-0 right-0 w-6 opacity-5 h-full z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

            {/* marquee row */}
            <div className="marquee w-max workTilesContainer h-[71%] flex gap-5 whitespace-nowrap py-1">
              {items.concat(items).map((item, i) => (
                <div
                  key={i}
                  className="w-[8%] workTiles shrink-0 p-1 h-full bg-brand-paragrey rounded-lg"
                >
                  <img
                    className="h-[90%] tileImg object-cover object-center rounded-md"
                    src={item.img}
                    alt={item.name}
                  />
                  <h4 className="font-semibold tileHeading text-white text-center w-full">
                    {item.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Work;
