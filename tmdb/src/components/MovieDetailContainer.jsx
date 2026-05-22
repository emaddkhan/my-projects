    import React from 'react'
import MovieDetailSideBar from './MovieDetailSideBar'
import MovieDetailRightSectionDetail from './MovieDetailRightSectionDetail'
    
    function MovieDetailContainer({movie,movieProvider}) {
      return (
        <div className='w-[73%] mx-auto flex justify-between   py-5'>
            <MovieDetailRightSectionDetail movie={movie}/>
            <MovieDetailSideBar movieProvider={movieProvider} movie={movie} />
        </div>
      )
    }
    
    export default MovieDetailContainer