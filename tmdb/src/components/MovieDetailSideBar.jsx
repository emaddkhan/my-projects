import React from 'react'
import MovieWatchBtn from './MovieWatchBtn'

function MovieDetailSideBar({movieProvider}) {
  return (
    <div className='w-[23%] p-1 '>
      <MovieWatchBtn movieProvider={movieProvider}/>
    </div>
  )
}

export default MovieDetailSideBar