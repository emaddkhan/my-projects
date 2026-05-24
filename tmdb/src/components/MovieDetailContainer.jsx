    import React from 'react'
import MovieDetailSideBar from './MovieDetailSideBar'
import MovieDetailRightSectionDetail from './MovieDetailRightSectionDetail'
    
    function MovieDetailContainer({bgColor,movie,movieProvider}) {
      return (
        <div className='w-[73%] mx-auto flex justify-between   py-5'>
            <MovieDetailRightSectionDetail movie={movie}/>
            <MovieDetailSideBar bgColor={bgColor} movieProvider={movieProvider} movie={movie} />
        </div>
      )
    }
    
    export default MovieDetailContainer