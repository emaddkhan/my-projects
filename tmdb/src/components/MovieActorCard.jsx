import React from 'react'
import actor from "../assets/actor.jpg"
import { IMAGE_BASE_URL } from "../api/config";



function MovieActorCard({movie}) {
    const posterUrl = movie.profile_path
    ? `${IMAGE_BASE_URL}${movie.profile_path}`
    : actor;
    
  return (
    <div className='w-[7.5vw] shrink-0 h-full border-1 border-[#F2F2F2] bg-white rounded-lg overflow-hidden '>
            <div className='h-[70%] w-full '>
                <img className='w-full object-cover object-top h-full' src={posterUrl} alt="" />
            </div>
            <div className='h-[30%] p-2 pt-3 w-full '>
                <h2 className='text-sm font-bold'>{movie.name}</h2>
                <p className='text-xs pb-1'>{movie?.character}'</p>
                {/* <p className='text-xs pb-1'>Robinavitch</p>
                <p className='text-xs pb-1'>30 Episodes</p> */}
            </div>
        </div>
  )
}

export default MovieActorCard