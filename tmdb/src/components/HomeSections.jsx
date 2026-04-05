import React from 'react'
import InnerNav from './InnerNav'
import HomeMovieDisplay from './HomeMovieDisplay'
import sectionBg from '../assets/section1.svg'

function HomeSections({sectionTitles, activeTab, tabs,showSectionBg, setActiveTab, moviesToShow }) {

  return (
    <div className='py-7 w-full' >
      <div className="sectionContainer w-[63%]  mx-auto h-full" style={{ backgroundImage: showSectionBg ? `url(${sectionBg})` : 'transparent',backgroundRepeat: 'no-repeat',backgroundPosition: 'bottom', }} >
        <div className='sectionUpper flex items-center gap-6'>
          <h2 className='text-[1.2vw] font-semibold'>{sectionTitles}</h2>
          {/* Pass tab state and setter */}
          <InnerNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Display movies based on active tab */}
        <HomeMovieDisplay  movies={moviesToShow} />
      </div>
    </div>
  )
}

export default HomeSections