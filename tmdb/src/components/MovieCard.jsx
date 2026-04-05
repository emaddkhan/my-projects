import React from 'react'
import movieImg from '../assets/movie1.jpg'

function MovieCard() {
  return (
    <div className='w-[9vw] p-1 mt-3 shrink-0  overflow-hidden'>
        <img className='w-full rounded-xl' src={movieImg} alt="" />
        <h4 className='font-semibold text-[.8vw]'>Avatar: Fire and AsH</h4>
        <p className='text-[.8.5vw] text-[#8B909B]'>17 december 2025</p>
    </div>
  )
}

export default MovieCard