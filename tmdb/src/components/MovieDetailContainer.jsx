    import React from 'react'
import MovieDetailSideBar from './MovieDetailSideBar'
import MovieDetailRightSectionDetail from './MovieDetailRightSectionDetail'
    
    function MovieDetailContainer({movie}) {
      return (
        <div className='w-[73%] mx-auto flex justify-between  bg-amber-500 py-5'>
            <MovieDetailRightSectionDetail movie={movie}/>
            <MovieDetailSideBar/>
        </div>
      )
    }
    
    export default MovieDetailContainer