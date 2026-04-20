import React from 'react'
import MovieDetailCastSection from './MovieDetailCastSection'
import MovieDetailMediaSection from './MovieDetailMediaSection'

function MovieDetailRightSectionDetail({movie}) {
  return (
    <div className='w-[76%] p-1 '>
        <MovieDetailCastSection movie={movie}/>
        <MovieDetailMediaSection movie={movie}/>
    </div>
  )
}

export default MovieDetailRightSectionDetail