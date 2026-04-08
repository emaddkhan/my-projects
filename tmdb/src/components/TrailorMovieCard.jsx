import React from 'react'
import TrailorImg from '../assets/trailorImg.jpg'
import { IMAGE_BASE_URL } from '../api/config'
function TrailorMovieCard({movie}) {
    const postUrl=movie.poster_path?`${IMAGE_BASE_URL}${movie.poster_path}`:TrailorImg;
    const shortOverview = movie.overview.length > 100 ? movie.overview.slice(0, 100) + "..." : movie.overview;
  return (
    <div className='h-[28.7vh] w-[15vw] shrink-0'>
        <div className=' h-[70%] w-full relative'>
          <img className='object-cover object-top rounded-xl h-full w-full bg-blue-300' src={postUrl} alt="Trailer" />
          <div></div>
        </div>
        <h2 className='font-bold leading-none pt-1 text-[.9vw] text-white text-center'>{movie.original_title}</h2>
        <p className='text-center leading-none pt-1 text-white font-semibold text-[.7vw]'>{shortOverview}</p>
    </div>
  )
}

export default TrailorMovieCard