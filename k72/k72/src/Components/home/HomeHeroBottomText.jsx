import React from 'react'
import { Link } from 'react-router-dom'

function HomeHeroBottomText() {
  return (
    <div className='flex text-white items-center justify-center gap-10 font-[font2] '>
      <Link to='/projects' className='text-[6vw] leading-[6vw] flex items-end px-8 border-2 rounded-full uppercase'>Work</Link>
      <Link to='/agency' className='text-[6vw] leading-[6vw] flex items-end px-8 border-2 rounded-full uppercase'>Agency </Link>
    </div>
  )
}

export default HomeHeroBottomText