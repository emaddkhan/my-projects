import React, { useEffect, useRef, useState } from "react";
import { IMAGE_BASE_URL } from "../api/config";
import VideoPlayer from "./VideoPlayer";
import playBtn from "../assets/playBtn.png";

function MovieDetailMediaSection({ movie }) {
  const [mostPopular, setMostPopular] = useState([]);
  const [videoKey, setVideoKey] = useState(null);

  const [activeTab, setActiveTab] = useState(0);
  const navRefs = useRef([]);

  const videos = movie?.videos?.results || [];
  const backdrops = movie?.images?.backdrops || [];
  const posters = movie?.images?.posters || [];
  const backdropMedia = backdrops.slice(0, 8);
  const videoMedia = videos
    .filter((v) => v.site === "YouTube" && v.key)
    .slice(0, 8);
  const posterMedia=posters.slice(0,8)
  const mediaNav = [
    { title: "Most Popular", value: "popular" },
    { title: "Videos", value: "videos", length: videos.length },
    { title: "Backdrops", value: "backdrops", length: backdrops.length },
    { title: "Posters", value: "posters", length: posters.length },
  ];

  // MOST POPULAR DATA
  useEffect(() => {
    const officialTrailer =
      videos.find(
        (v) =>
          v.type === "Trailer" && v.site === "YouTube" && v.official === true,
      ) ||
      videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
      videos[0];
    const video = officialTrailer
      ? { ...officialTrailer, type: "video" }
      : null;

    const backdrop = backdrops[0]
      ? { ...backdrops[0], type: "backdrop" }
      : null;

    const poster = posters[0] ? { ...posters[0], type: "poster" } : null;

    const data = [video, backdrop, poster].filter(Boolean);

    setMostPopular(data);
  }, [videos, backdrops, posters]);

  // UNDERLINE
  const [underline, setUnderline] = useState({
    x: 0,
    width: 0,
  });

  useEffect(() => {
    const el = navRefs.current[activeTab];

    if (el) {
      setUnderline({
        x: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <>
      <div className=" w-full py-5  border-b-2 border-[#D7D7D7] ">
        <div className="upperMediaNav pb-5 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <h2 className="font-semibold text-2xl">Media</h2>

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
                      className={`text-[1vw] font-semibold ${
                        activeTab === i ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {item.title}
                    </h2>

                    {item?.length > 0 && (
                      <span className="text-[0.9vw] text-gray-500">
                        {item.length}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div
                className="absolute -bottom-1 h-[2px] bg-black rounded-full"
                style={{
                  width: underline.width,
                  transform: `translateX(${underline.x}px)`,
                  transition: "all 600ms ease",
                }}
              />
            </div>
          </div>
          {
            activeTab !==0 &&(
              
            <h2 className="text-[#025A7C] font-semibold cursor-pointer text-sm">Show all {mediaNav[activeTab].title}</h2>
          
            )
          }
        </div>

        <div className="flex w-full h-[35vh] overflow-x-auto overflow-y-hidden ">
          {activeTab === 0 &&
            mostPopular.map((item, index) => {
              if (item.type === "video") {
                return (
                  <div
                    key={index}
                    onClick={() => setVideoKey(item.key)}
                    className="relative min-w-[60%] h-full cursor-pointer group"
                  >
                    <img
                      src={
                        backdrops[0]?.file_path
                          ? `${IMAGE_BASE_URL}${backdrops[0]?.file_path}`
                          : `https://i.ytimg.com/vi/${item.key}/hq720.jpg`
                      }
                      onError={(e) => {
                        e.target.src = `https://i.ytimg.com/vi/${item.key}/hqdefault.jpg`;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      alt=""
                    />

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                        <img className="w-8" src={playBtn} alt="Play" />
                      </div>
                    </div>

                    <div className="absolute bottom-5 left-5">
                      <h2 className="text-3xl font-bold">{item.name}</h2>
                      <p className="text-zinc-300 text-sm">Play Trailer</p>
                    </div>
                  </div>
                );
              }

              if (item.type === "backdrop") {
                return (
                  <div
                    key={index}
                    className="relative min-w-[60%] h-full overflow-hidden group"
                  >
                    <img
                      src={`${IMAGE_BASE_URL}${item.file_path}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                );
              }

              if (item.type === "poster") {
                return (
                  <div
                    key={index}
                    className="relative min-w-[20%] h-full overflow-hidden group"
                  >
                    <img
                      src={`${IMAGE_BASE_URL}${item.file_path}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                );
              }
            })}
          {/* VIDEOS TAB */}
          {activeTab === 1 &&
            videoMedia.map((vid, i) => (
              <div
                key={i}
                onClick={() => setVideoKey(vid.key)}
                className="relative min-w-[60%] h-full cursor-pointer group overflow-hidden"
              >
                {/* THUMBNAIL */}
                <img
                  src={`https://img.youtube.com/vi/${vid.key}/hq720.jpg`}
                  onError={(e) => {
                    e.target.src = `https://img.youtube.com/vi/${vid.key}/hqdefault.jpg`;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  alt={vid.name}
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />

                {/* PLAY ICON */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                        <img className="w-8" src={playBtn} alt="Play" />
                      </div>
                </div>

                {/* TITLE */}
                <div className="absolute bottom-3 left-3">
                  <h2 className="text-white text-sm font-semibold line-clamp-1">
                    {vid.name}
                  </h2>
                </div>
              </div>
            ))}
          {activeTab === 2 &&
            backdropMedia.map((i, index) => {
              return (
                <img
                  className="h-full w-[60%]"
                  src={`${IMAGE_BASE_URL}${i.file_path}`}
                  alt=""
                />
              );
            })}
            {activeTab === 3 &&
            <>
            {
              posterMedia.map((i, index) => {
              return (
                <img
                  className="h-full w-[23%]"
                  src={`${IMAGE_BASE_URL}${i.file_path}`}
                  alt=""
                />
              );
            })
            }
            <div className="w-23% h-full flex justify-center items-center">
              <h2></h2>
            </div>
            </>
            }
        </div>
      </div>

      <VideoPlayer videoKey={videoKey} setVideoKey={setVideoKey} />
    </>
  );
}

export default MovieDetailMediaSection;
