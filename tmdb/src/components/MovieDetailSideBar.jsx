import React from 'react'
import MovieWatchBtn from './MovieWatchBtn'
import MovieSideBarIcons from './MovieSideBarIcons'
import MovieSideBarDetails from './movieSideBarDetails'

function MovieDetailSideBar({movieProvider,movie}) {
  return (
    <div className='w-[23%] p-1 '>
      <MovieWatchBtn movieProvider={movieProvider}/>
      <MovieSideBarIcons/>
      <MovieSideBarDetails movie={movie}/>
    </div>
  )
}

export default MovieDetailSideBar