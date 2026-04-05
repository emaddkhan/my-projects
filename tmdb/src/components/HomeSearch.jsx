import React from 'react'

function HomeSearch() {
  return (
    <div className='h-[2.4vw] rounded-full w-full relative flex items-center bg-white pl-4 pr-[.1vw]'>
        <input type="text" className='w-full h-full outline-none' placeholder='Search for a movie, tv show, person......' />
        <button className='bg-[#06BADB] text-white text-[.8vw] px-6 py-[.5vw] rounded-full  hover:text-black transition duration-300 absolute right-[.1vw]'>
          Search
        </button>
    </div>
  )
}

export default HomeSearch