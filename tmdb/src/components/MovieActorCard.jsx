import React from 'react'
import actor from "../assets/actor.jpg"


function MovieActorCard({movie}) {
  return (
    <div className='w-[8vw] shrink-0 h-full rounded-lg overflow-hidden bg-red-300'>
            <div className='h-[60%] w-full bg-amber-200'>
                <img className='w-full h-full' src={actor} alt="" />
            </div>
            <div className='h-[40%] p-2 pt-3 w-full bg-amber-300'>
                <h2 className='text-sm font-bold'>{movie.name}</h2>
                <p className='text-xs pb-1'>Dr. Michael 'Robby'</p>
                <p className='text-xs pb-1'>Robinavitch</p>
                <p className='text-xs pb-1'>30 Episodes</p>
            </div>
        </div>
  )
}

export default MovieActorCard