import React from 'react'
import { Link } from 'react-router-dom'

function HomeHeroBottomText() {
  return (
    <div className='flex text-white mb-[1vh] items-center justify-center gap-6 font-[font2] '>
      <div className='border-3 hover:border-[#D3FD50] hover:text-[#D3FD50] h-32 flex items-center px-10 border-white rounded-full uppercase'>
      <Link to='/projects' className='text-[6vw] mt-6' >Work</Link>

      </div>
      <div className='border-3 hover:border-[#D3FD50] hover:text-[#D3FD50] h-32 flex items-center px-10 border-white rounded-full uppercase'>
      <Link to='/agency' className='text-[6vw] mt-6'>Agency </Link>

      </div>
    </div>
  )
}

export default HomeHeroBottomText