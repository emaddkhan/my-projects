import React from "react";
import movieImg from "../assets/movie1.jpg";
import { IMAGE_BASE_URL } from "../api/config";
import RatingCircle from "./RatingCircle";

function MovieDetailBanner({ movie }) {
  if (!movie) return <div>Loading...</div>;

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : movieImg;
  //date
  const usReleaseDate = movie?.release_dates?.results?.find(
    (r) => r.iso_3166_1 === "US",
  )?.release_dates?.[0]?.release_date;
  const formattedDate = usReleaseDate
    ? new Date(usReleaseDate).toLocaleDateString("en-GB")
    : "N/A";
  //duration
  const formatedTime = (runtime) => {
    if (!runtime) return "N/A";
    const hours = Math.floor(runtime / 60);
    const min = runtime % 60;
    return `${hours}h ${min}m`;
  };
  return (
    <div className="h-[62.5vh] py-5 w-full bg-red-500">
      <div className="w-[69%] h-full flex justify-between items-center bg-amber-300 mx-auto">
        <div className="movieBannerLeft rounded-2xl overflow-hidden w-[22.5%] h-full bg-white ">
          <img className="h-full w-full" src={posterUrl} alt="" />
        </div>
        <div className="movieBannerRight h-full w-[75%] py-16">
          <h2 className="font-bold text-[1.8vw]">{movie.title}</h2>
          <div className="flex gap-2">
            <span className="text-sm border-1 px-1">R</span>
            <p className="text-sm">{formattedDate} (Us)</p>
            <div className="flex justify-center items-center ">
              <span className="h-1 w-1 rounded-full bg-black"></span>
            </div>
            <p className="text-sm">
              {movie?.genres?.map((g) => g.name).join(" and ")}{" "}
            </p>
            <div className="flex justify-center items-center ">
              <span className="h-1 w-1 rounded-full bg-black"></span>
            </div>
            <p className="text-sm">{formatedTime(movie.runtime)}</p>
          </div>
          <div className="flex mt-4 items-center gap-2 ">
            <div className="scroreeer h-13 w-13 flex justify-center items-center bg-[#081C22] rounded-full">
            <RatingCircle value={movie.vote_average} />
          </div>
          <h4 className="font-semibold leading-[1.1vw]">User<br/>Score</h4>
          </div>
          <div className="flex items-center gap-5">
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailBanner;
