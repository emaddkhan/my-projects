import React from 'react'
import InnerNav from './InnerNav'
import HomeMovieDisplay from './HomeMovieDisplay'

function HomeSections({ activeTab, setActiveTab, moviesToShow }) {

  return (
    <div className='py-7 w-full'>
      <div className="sectionContainer w-[63%] mx-auto h-full">
        <div className='sectionUpper flex items-center gap-6'>
          <h2 className='text-[1.2vw] font-semibold'>Trending</h2>
          {/* Pass tab state and setter */}
          <InnerNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Display movies based on active tab */}
        <HomeMovieDisplay movies={moviesToShow} />
      </div>
    </div>
  )
}

export default HomeSections