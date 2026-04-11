import React from 'react'
import TrailorImg from '../assets/trailorImg.jpg'
import { IMAGE_BASE_URL } from '../api/config'
import playBtn from '../assets/playBtn.png'
import {getOnRentTrailorMovieVideos} from '../api/movies'

function TrailorMovieCard({setTrailorLoading, setShowSection3Bg, movie, setVideoKey }) {

  const postUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : TrailorImg;

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : TrailorImg;

  const shortOverview =
    movie.overview.length > 100
      ? movie.overview.slice(0, 100) + "..."
      : movie.overview;

  const handleCardClick = async () => {
    try {
      setTrailorLoading(true); 
      const videosData = await getOnRentTrailorMovieVideos(movie.id);

      const trailer = videosData?.results?.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailer) {
        setVideoKey(trailer.key); // ✅ correct state
      }
      setTrailorLoading(false);

    } catch (error) {
      console.error("Error fetching trailer videos:", error);
      setTrailorLoading(false);
    }
  };

  return (
    <div
      className='h-[28.7vh] w-[15vw] shrink-0 cursor-pointer'
      onMouseEnter={() => setShowSection3Bg(backdropUrl)}
      onClick={handleCardClick}
    >
      <div className='h-[70%] w-full relative'>

        <img
          className='object-cover object-top rounded-xl h-full w-full bg-blue-300'
          src={postUrl}
          alt="Trailer"
        />

        <img
          className='absolute top-[50%] left-[50%] w-[50px] translate-x-[-50%] translate-y-[-50%]'
          src={playBtn}
          alt="Play"
        />

      </div>

      <h2 className='font-bold leading-none pt-1 text-[.9vw] text-white text-center'>
        {movie.original_title}
      </h2>

      <p className='text-center leading-none pt-1 text-white font-semibold text-[.7vw]'>
        {shortOverview}
      </p>
    </div>
  );
}

export default TrailorMovieCard;