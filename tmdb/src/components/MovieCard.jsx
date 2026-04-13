import React from "react";
import movieImg from "../assets/movie1.jpg";
import { IMAGE_BASE_URL } from "../api/config";
import { useNavigate } from "react-router-dom";

function MovieCard({ setShowSection3Bg, activeTab, movie }) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`,{state:movie});
  }
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : movieImg;
  return (
    <div onClick={handleCardClick} className="w-[9vw] p-1 mt-3 shrink-0  overflow-hidden ">
      <img
        onMouseEnter={() => setShowSection3Bg(movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null)}
        className="w-[9vw] rounded-xl"
        src={posterUrl}
        alt={movie.original_title}
      />
      <h4 className="font-semibold w-full text-[.8vw]">
        {activeTab === "tv" ? movie.original_name : movie.original_title}
      </h4>
      <p className="text-[.8.5vw] text-[#8B909B]">
        {activeTab === "tv" ? movie.first_air_date : movie.release_date}
      </p>
    </div>
  );
}

export default MovieCard;
