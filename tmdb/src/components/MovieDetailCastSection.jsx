import React from 'react'
import MovieDetailSectionCastContainer from './MovieDetailSectionCastContainer'
import MovieDetailMediaSection from './MovieDetailMediaSection'

function MovieDetailCastSection({movie}) {
  return (
    <div className='w-full h-[42vh] py-3   border-b-1 border-[#D7D7D7] ' >
        <h2 className='font-semibold text-xl'>Series Cast</h2>
        <MovieDetailSectionCastContainer movie={movie}/>
        <h2 className='font-semibold underline text-[.9vw]  underline-offset-4 decoration-0 cursor-pointer hover:text-[#D7D7D7] transition-all duration-300 ease-in-out'>Full Cast & Crew</h2>
        
    </div>
  )
}

export default MovieDetailCastSection