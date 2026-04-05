import React from 'react'
import movieImg from '../assets/movie1.jpg'
import { IMAGE_BASE_URL } from '../api/config'

function MovieCard({movie}) {
  const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : movieImg;
  return (
    <div className='w-[9vw] p-1 mt-3 shrink-0  overflow-hidden'>
        <img className='w-[9vw] rounded-xl' src={posterUrl} alt={movie.original_title} />
        <h4 className='font-semibold w-full text-[.8vw]'>{movie.original_title}</h4>
        <p className='text-[.8.5vw] text-[#8B909B]'>{movie.release_date}</p>
    </div>
  )
}

export default MovieCard