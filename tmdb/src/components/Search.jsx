import React from 'react'
import search from '../assets/search2.png'


function Search() {
  return (
    <div className='h-[2.4vw] w-full bg-white'>
        <div className='searchContainer w-[63%] gap-2 flex items-center mx-auto h-full'>
            <img className='h-[15px]' src={search} alt="Search" />
            <input className='w-full outline-none font-semibold text-[.8vw] px-2 italic h-full' type="text" placeholder='Search for a movie,tv show,person...' />
        </div>
    </div>
  )
}

export default Search