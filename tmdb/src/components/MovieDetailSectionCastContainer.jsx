import React from 'react'
import actor from "../assets/actor.jpg"
import MovieActorCard from './MovieActorCard'
function MovieDetailSectionCastContainer({movie}) {
    console.log(movie)
  return (
    <div className='h-[35.5vh] w-full flex gap-4 overflow-x-auto   bg-blue-300 pt-1'>
        
        {movie?.credits?.cast.map((item,i)=>{
            return(
                <MovieActorCard key={i} movie={item}/>
            )
        })}
    </div>
  )
}

export default MovieDetailSectionCastContainer