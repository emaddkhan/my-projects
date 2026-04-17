import React from 'react'
import MovieDetailCastSection from './MovieDetailCastSection'

function MovieDetailRightSectionDetail({movie}) {
  return (
    <div className='w-[76%] p-1 bg-red-500'>
        <MovieDetailCastSection movie={movie}/>
    </div>
  )
}

export default MovieDetailRightSectionDetail