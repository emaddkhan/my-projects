import React from 'react'
import MovieDetailSectionCastContainer from './MovieDetailSectionCastContainer'

function MovieDetailCastSection({movie}) {
  return (
    <div className='w-full h-[40vh] py-3 ' >
        <h2 className='font-semibold text-xl'>Series Cast</h2>
        <MovieDetailSectionCastContainer movie={movie}/>
    </div>
  )
}

export default MovieDetailCastSection