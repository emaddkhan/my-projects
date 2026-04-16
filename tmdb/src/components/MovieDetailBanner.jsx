import React from "react";
import movieImg from "../assets/movie1.jpg";
import { IMAGE_BASE_URL } from "../api/config";
import RatingCircle from "./RatingCircle";
import list from "../assets/list-solid-full.svg";
import heart from "../assets/heart-solid-full.svg";
import save from "../assets/floppy-disk-solid-full.svg";

function MovieDetailBanner({ movie }) {
  if (!movie) return <div>Loading...</div>;

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : movieImg;

  // ✅ Dynamic release logic (no hardcoded country)
  const getBestReleaseInfo = (movie) => {
    const originCountry =
      movie?.production_countries?.[0]?.iso_3166_1;

    const originDate =
      movie?.release_dates?.results?.find(
        (r) => r.iso_3166_1 === originCountry
      )?.release_dates?.[0]?.release_date;

    if (originDate) {
      return {
        date: originDate,
        country: originCountry,
      };
    }

    const firstRegion = movie?.release_dates?.results?.[0];

    if (firstRegion?.release_dates?.[0]?.release_date) {
      return {
        date: firstRegion.release_dates[0].release_date,
        country: firstRegion.iso_3166_1,
      };
    }

    if (movie?.release_date) {
      return {
        date: movie.release_date,
        country: "N/A",
      };
    }

    return {
      date: null,
      country: "N/A",
    };
  };

  const releaseInfo = getBestReleaseInfo(movie);

  const formattedDate = releaseInfo.date
    ? new Date(releaseInfo.date).toLocaleDateString("en-GB")
    : "N/A";

  // ✅ Safe runtime
  const formatedTime = (runtime) => {
    if (!runtime || runtime <= 0) return "N/A";
    const hours = Math.floor(runtime / 60);
    const min = runtime % 60;
    return `${hours}h ${min}m`;
  };

  // ✅ Safe genres
  const genres =
    movie?.genres?.length > 0
      ? movie.genres.map((g) => g.name).join(" and ")
      : "Unknown";

  const icons = [
    { src: list, label: "Add to List" },
    { src: heart, label: "Add to Favorites" },
    { src: save, label: "Add to Watchlist" },
  ];

  return (
    <div style={{}} className="h-[62.5vh] py-5 w-full bg-red-500">
      <div className="w-[69%] h-full flex justify-between items-center bg-amber-300 mx-auto">

        {/* Poster */}
        <div className="movieBannerLeft rounded-2xl overflow-hidden w-[22.5%] h-full bg-white">
          <img
            className="h-full w-full object-cover"
            src={posterUrl}
            alt={movie.title}
          />
        </div>

        {/* Details */}
        <div className="movieBannerRight h-full w-[75%] py-16">

          <h2 className="font-bold text-[1.8vw]">{movie.title}</h2>

          <div className="flex gap-2 items-center flex-wrap">

            <span className="text-sm border px-1">R</span>

            <p className="text-sm">
              {formattedDate} ({releaseInfo.country})
            </p>

            <span className="h-1 w-1 rounded-full bg-black"></span>

            <p className="text-sm">{genres}</p>

            <span className="h-1 w-1 rounded-full bg-black"></span>

            <p className="text-sm">{formatedTime(movie.runtime)}</p>
          </div>

          {/* Rating */}
          <div className="flex mt-4 items-center gap-2">
            <div className="h-13 w-13 flex justify-center items-center bg-[#081C22] rounded-full">
              <RatingCircle value={movie.vote_average} />
            </div>
            <h4 className="font-semibold leading-[1.1vw]">
              User<br />Score
            </h4>
          </div>

          {/* Icons */}
          <div className="flex items-center mt-3 gap-5">
            {icons.map((item, i) => (
              <div
                key={i}
                className="w-10 h-10 flex justify-center items-center bg-[#081C22] rounded-full relative group cursor-pointer hover:scale-110 transition"
              >
                <img className="w-4" src={item.src} alt={item.label} />

                {/* tooltip */}
                <div
                  className="absolute top-[120%] left-1/2 -translate-x-1/2 
                  bg-[#081C22] text-white text-xs px-2 py-1 
                  rounded opacity-0 group-hover:opacity-100 
                  transition whitespace-nowrap"
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default MovieDetailBanner;