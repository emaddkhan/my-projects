import React from 'react'
import MovieDetailCastSection from './MovieDetailCastSection'
import MovieDetailMediaSection from './MovieDetailMediaSection'
import SimilarMovieSection from './SimilarMovieSection'

function MovieDetailRightSectionDetail({movie}) {
  return (
    <div className='w-[76%] p-1 '>
        <MovieDetailCastSection movie={movie}/>
        <MovieDetailMediaSection movie={movie}/>
        <SimilarMovieSection movie={movie}
         similarMovies={movie?.similar?.results || []}/>
    </div>
  )
}

export default MovieDetailRightSectionDetail