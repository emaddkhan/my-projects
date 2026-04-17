import React from 'react'
import actor from "../assets/actor.jpg"
import MovieActorCard from './MovieActorCard'
import arrowRight from "../assets/arrow-right-solid-full.svg"
function MovieDetailSectionCastContainer({movie}) {
    console.log(movie)
    const cast =movie?.credits?.cast||[];
  return (
    <div className='h-[30.5vh] w-full flex gap-4 overflow-x-auto pb-4  0 pt-1'>
        
        {cast.slice(0,10).map((item,i)=>{
            return(
                <MovieActorCard key={i} movie={item}/>
            )
        })}
        {cast.length > 10 && (
        <div className="flex items-center justify-center min-w-[120px]">
          <button className=" flex gap-1 text-sm items-center font-bold  ">
            View More <img className='w-[15px]' src={arrowRight}/>
          </button>
        </div>
      )}
    </div>
  )
}

export default MovieDetailSectionCastContainer