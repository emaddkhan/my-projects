import React from 'react'
import playBtn from "../assets/playBtn.png";


function MovieWatchBtn({movieProvider=null}) {
    console.log("moviePro",movieProvider)
   
  return (
    <div className='w-full h-[5.5vh] flex justify-between items-center py-2 px-3 bg-[#F0F0F0]'>
        <button href={movieProvider?.link} target='_blank'  rel="noreferrer" className='w-[47%] h-full flex justify-center gap-1 items-center bg-[#57AFD5] rounded'>
            <img className='w-5 animate-pulseZoom' src={playBtn} alt="" />
            <h4 className='font-semibold text-sm text-white'>Watch Now</h4>
        </button>
        <p className='text-right leading-[.6vw] tracking-tight text-xs'>For All Mankind on <br /><span className='font-semibold'>{movieProvider?.buy?.[0]?.provider_name}</span></p>
    </div>
  )
}

export default MovieWatchBtn