import React, { useState, useEffect } from "react";
import movieImg from "../assets/movie1.jpg";
import TrailorImg from "../assets/trailorImg.jpg";
import { IMAGE_BASE_URL } from "../api/config";
import RatingCircle from "./RatingCircle";
import list from "../assets/list-solid-full.svg";
import heart from "../assets/heart-solid-full.svg";
import save from "../assets/floppy-disk-solid-full.svg";
import playBtn from "../assets/playBtn.png";
import { getOnRentTrailorMovieVideos } from "../api/movies";

function MovieDetailBanner({ setTrailorLoading, movie, setVideoKey }) {
  if (!movie) return <div>Loading...</div>;

  const [bgColor, setBgColor] = useState([0, 0, 0]);

  // 🎨 dominant color extractor
  const getDominantColor = (img) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let r = 0,
      g = 0,
      b = 0,
      count = 0;

    for (let i = 0; i < data.length; i += 40) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    return [
      Math.floor(r / count),
      Math.floor(g / count),
      Math.floor(b / count),
    ];
  };

  // 🎨 extract color
  useEffect(() => {
    if (!movie?.backdrop_path) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `${IMAGE_BASE_URL}${movie.backdrop_path}`;

    img.onload = () => {
      const color = getDominantColor(img);
      const dark = color.map((c) => Math.floor(c * 0.6));
      setBgColor(dark);
    };
  }, [movie]);

  // 🎬 trailer handler
  const handleCardClick = async () => {
    try {
      setTrailorLoading(true);

      const videosData = await getOnRentTrailorMovieVideos(movie.id);

      const trailer = videosData?.results?.find(
        (video) => video.type === "Trailer" && video.site === "YouTube",
      );

      if (trailer) setVideoKey(trailer.key);

      setTrailorLoading(false);
    } catch (error) {
      console.error(error);
      setTrailorLoading(false);
    }
  };

  // 📸 images
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : movieImg;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : TrailorImg;

  // 📅 release logic
  const getBestReleaseInfo = (movie) => {
    const originCountry = movie?.production_countries?.[0]?.iso_3166_1;

    const allRegions = movie?.release_dates?.results || [];

    // helper to get valid rating
    const getValidRating = (arr) =>
      arr?.find((r) => r.certification && r.certification.trim() !== "")
        ?.certification || null;

    // 1st priority: origin country
    const originRegion = allRegions.find((r) => r.iso_3166_1 === originCountry);

    const originData = originRegion?.release_dates?.[0];

    if (originData?.release_date) {
      return {
        date: originData.release_date,
        country: originCountry,
        rating: getValidRating(originRegion?.release_dates),
      };
    }

    // 2nd priority: any region with valid date
    const firstRegion = allRegions.find((r) => r.release_dates?.length > 0);

    const firstData = firstRegion?.release_dates?.[0];

    if (firstData?.release_date) {
      return {
        date: firstData.release_date,
        country: firstRegion.iso_3166_1,
        rating: getValidRating(firstRegion?.release_dates),
      };
    }

    return {
      date: movie?.release_date,
      country: "N/A",
      rating: "N/A",
    };
  };
  const releaseInfo = getBestReleaseInfo(movie);
  console.log("release", releaseInfo);

  const formattedDate = releaseInfo.date
    ? new Date(releaseInfo.date).toLocaleDateString("en-GB")
    : "N/A";

  // ⏱ runtime
  const formatedTime = (runtime) => {
    if (!runtime) return "N/A";
    const hours = Math.floor(runtime / 60);
    const min = runtime % 60;
    return `${hours}h ${min}m`;
  };

  // 🎭 genres
  const genres =
    movie?.genres?.length > 0
      ? movie.genres.map((g) => g.name).join(" and ")
      : "Unknown";

  //getting only writer and director data
  const crew =movie?.credits?.crew||[];
  
  const getCrewMember = (crew, jobs) =>
  crew.find(c => jobs.includes(c.job));

const director = getCrewMember(crew, ["Director"]);
const writer = getCrewMember(crew, ["Writer", "Screenplay", "Story"]);
console.log(writer)
console.log(director)
  return (
    <div
      style={{
        backgroundImage: `
    linear-gradient(
      to right,
      rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.95),
      rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.5),
      rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.2)
    ),
    url(${backdropUrl})
  `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="h-[62.5vh] text-white py-5 w-full"
    >
      <div className="w-[69%] h-full flex justify-between items-center mx-auto">
        {/* Poster */}
        <div className="rounded-2xl overflow-hidden w-[22.5%] h-full bg-white">
          <img
            className="h-full w-full object-cover"
            src={posterUrl}
            alt={movie.title}
          />
        </div>

        {/* Details */}
        <div className="h-full w-[75%] py-8">
          <h2 className="font-bold text-[1.8vw]">{movie.title}</h2>

          {/* release + genre + runtime */}
          <div className="flex flex-wrap items-center gap-3 text-sm mt-2 opacity-90">
            {releaseInfo.rating && (
              <span className="py-[.1vw] px-2 text-xs border-1 border-white">
                {releaseInfo.rating}
              </span>
            )}
            <span>
              {formattedDate} ({releaseInfo.country})
            </span>
            <span>•</span>
            <span>{genres}</span>
            <span>•</span>
            <span>{formatedTime(movie.runtime)}</span>
          </div>

          {/* Rating */}
          <div className="flex mt-4 items-center gap-2">
            <div className="h-13 w-13 flex justify-center items-center bg-[#081C22] rounded-full">
              <RatingCircle value={movie.vote_average} />
            </div>
            <h4 className="font-semibold leading-[1.1vw]">
              User
              <br />
              Score
            </h4>
          </div>

          <div className="flex items-center mt-3 gap-5">
            {[list, heart, save].map((icon, i) => (
              <div
                key={i}
                className="w-10 h-10 flex justify-center items-center bg-[#081C22] rounded-full hover:scale-110 transition"
              >
                <img className="w-4" src={icon} />
              </div>
            ))}

            <div
              onClick={handleCardClick}
              className="flex gap-1 cursor-pointer items-center"
            >
              <img className="w-5" src={playBtn} />
              <h2 className="font-semibold">Play Trailer</h2>
            </div>
          </div>
          <h4 className="italic text-[#B0AEAC] text-[1vv] mt-6">
            {movie.tagline}
          </h4>
          <h2 className="text-[1.1vw] font-semibold mt-3">Overview</h2>
          <p className="mt-1 text-sm">{movie.overview}</p>
          <div className="mt-5 flex gap-20 items-center">
            <div>
              <h3 className="font-semibold underline underline-offset-4 decoration-0 text-sm">{director.name}</h3>
              <p className="text-xs pt-1">{director.job}</p>
            </div>
            <div>
              <h3 className="font-semibold underline underline-offset-4 decoration-0 text-sm">{writer.name}</h3>
              <p className="text-xs pt-1">{writer.job}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailBanner;
