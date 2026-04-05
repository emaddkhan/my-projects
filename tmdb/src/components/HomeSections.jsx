import React from 'react'
import InnerNav from './InnerNav'

function HomeSections() {
  return (
    <div className='bg-amber-100 py-4 w-full'>
        <div className="sectionContainer w-[63%] mx-auto h-full bg-amber-300">
            <div className='sectionUpper flex items-center gap-6' >
                <h2 className='text-[1.2vw] font-semibold '>Trending</h2>
                <InnerNav />
            </div>
        </div>
    </div>
  )
}

export default HomeSections