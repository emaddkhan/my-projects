import React, { useState } from "react";
import movieImg from "../assets/similarMovie.jpg";
import calenderIcon from "../assets/calender.svg";
import { IMAGE_BASE_URL } from "../api/config";
import { useNavigate } from "react-router-dom";

function SimilarMovieSection({ movie, similarMovies = [] }) {
    const navigate =useNavigate();
    const [hoverId,setHoverId]=useState(null);

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
            const handleClick=()=>{
                navigate(`/movie/${item.id}`,{state:item})
            }
          return (
            <div
              key={item.id}
              className="min-w-[27%] h-[25vh] cursor-pointer"
              onClick={handleClick}
              onMouseEnter={()=>setHoverId(item.id)}
              onMouseLeave={()=>setHoverId(null)}
            >

              <div
                className="h-[85%] w-full relative rounded-2xl transition-all duration-300 ease-in overflow-hidden bg-center bg-cover"
                style={{ backgroundImage: `url(${movieImgUrl})` }}
              >
                {
                  hoverId===item.id && (
                    <div className="w-full flex gap-1 items-center px-5 bg-[#E6E7EC] absolute bottom-0 h-[20%] ">
                  <img className="w-4" src={calenderIcon} alt="" />
                  <p className="text-sm">{item?.release_date||item?.first_air_date}</p>
                </div>
                  )
                }
              </div>

              <div className="w-full flex items-center justify-between mt-1">
                <h2 className="text-[.9vw] font-semibold line-clamp-1">
                  {item?.title || item?.name}
                </h2>

                <p className="text-[.9vw]">
                  {Math.round(item?.vote_average * 10)}%
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