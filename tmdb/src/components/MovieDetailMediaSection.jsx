import React, { useEffect, useRef, useState } from "react";
import { IMAGE_BASE_URL } from "../api/config";

function MovieDetailMediaSection({ movie }) {
  const [mostPopular, setMostPopular] = useState([]);

  const [activeTab, setActiveTab] = useState(0);
  const navRefs = useRef([]);
  const videos = movie?.videos?.results || [];
  const backdrops = movie?.images?.backdrops || [];
  const posters = movie?.images?.posters || [];


  const mediaNav = [
    { title: "Most Popular", value: "popular" },
    { title: "Videos", value: "videos", length: videos.length },
    { title: "Backdrops", value: "backdrops", length: backdrops.length },
    { title: "Posters", value: "posters", length: posters.length },
  ];

  useEffect(() => {
    const video = videos[0] ? { ...videos[0], type: "video" } : null;

    const backdrop = backdrops[0]
      ? { ...backdrops[0], type: "backdrop" }
      : null;

    const poster = posters[0] ? { ...posters[0], type: "poster" } : null;

    const data = [video, backdrop, poster].filter(Boolean);

    setMostPopular(data);

    console.log("🔥 MOST POPULAR:", data);
  }, [videos, backdrops, posters]);

  

  const [underline, setUnderline] = useState({
    x: 0,
    width: 0,
  });
  const backdropMedia = backdrops.slice(0, 7);
  const posterMedia = posters.slice(0, 7);
  
  useEffect(() => {
    const el = navRefs.current[activeTab];

    if (el) {
      setUnderline({
        x: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeTab]);

  console.log("mostPopular", mostPopular);
  console.log("backdropMedia", backdropMedia);
  console.log("posterMedia", posterMedia);
  const postUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "";

  return (
    <div className="bg-amber-300 h-[45vh] w-full py-5">
      <div className="upperMediaNav pb-5 bg-amber-100 flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <h2 className="font-semibold text-xl">Media</h2>

          <div className="relative flex gap-7 items-center">
            {mediaNav.map((item, i) => (
              <div
                key={i}
                ref={(el) => (navRefs.current[i] = el)}
                onClick={() => setActiveTab(i)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <h2
                    className={`text-[1vw] font-semibold transition-colors duration-300 ${activeTab === i ? "text-black" : "text-gray-500"}`}
                  >
                    {item.title}
                  </h2>

                  {item?.length > 0 && (
                    <span className="text-[0.9vw] text-[#D7D7D7]">
                      {item.length}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* UNDERLINE */}
            <div
              className="absolute bottom-0 h-[2px] bg-black rounded-full"
              style={{
                width: underline.width,
                transform: `translateX(${underline.x}px)`,
                transition:
                  "transform 2000ms cubic-bezier(0.16, 1, 0.3, 1), width 2000ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h2 className="text-[#2ACEF3] capitalize font-semibold cursor-pointer">
            {activeTab === 0 ? "" : `show all ${mediaNav[activeTab].value}`}
          </h2>
        </div>
      </div>
      <div className="mediaShowCaseContainer flex w-full h-[34.6vh] bg-amber-50  ">
        {mostPopular.map((i)=>{
            return(
                <div >

                </div>
            )
        })}
      </div>
    </div>
  );
}

export default MovieDetailMediaSection;
