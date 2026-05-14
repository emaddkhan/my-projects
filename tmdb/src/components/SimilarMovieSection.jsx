import React from "react";
import movieImg from "../assets/similarMovie.jpg";
import { IMAGE_BASE_URL } from "../api/config";
import { useNavigate } from "react-router-dom";

function SimilarMovieSection({ movie, similarMovies = [] }) {
    const navigate =useNavigate();
  return (
    <div className="w-full py-3">

      <h4 className="text-[1vw] font-semibold mb-4">
        If you liked{" "}
        <i className="text-[#D7D7D7]">
          {movie?.title || movie?.name}
        </i>
        , you might also like...
      </h4>

      <div className="flex gap-5 overflow-x-auto">

        {similarMovies.map((item) => {

          const movieImgUrl = item?.poster_path
            ? `${IMAGE_BASE_URL}${item.poster_path}`
            : movieImg;
            console.log("item",item);
            const handleClick=()=>{
                navigate(`/movie/${item.id}`,{state:item})
            }
          return (
            <div
              key={item.id}
              className="min-w-[27%] h-[25vh] cursor-pointer"
              onClick={handleClick}
            >

              <div
                className="h-[85%] w-full rounded-2xl overflow-hidden bg-center bg-cover"
                style={{ backgroundImage: `url(${movieImgUrl})` }}
              ></div>

              <div className="w-full flex items-center justify-between mt-1">
                <h2 className="text-[.9vw] font-semibold line-clamp-1">
                  {item.title || item.name}
                </h2>

                <p className="text-[.9vw]">
                  {Math.round(item.vote_average * 10)}%
                </p>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default SimilarMovieSection;