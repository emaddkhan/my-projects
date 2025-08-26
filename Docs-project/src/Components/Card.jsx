import React from 'react'
import { FaRegFileAlt } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";


function Card() {
  return (
    <div className='relative w-60 h-72 text-white px-5 py-10 rounded-[45px] bg-zinc-900/90 overflow-hidden'>
      <FaRegFileAlt/>
      <p className='mt-5 text-sm leading-tight font-semibold'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo, eligendi?</p>
      <div className='footer absolute bottom-0 left-0  w-full  '>
        <div className='flex items-center justify-between py-3 px-8 mb-3'>
          <h5>.4mb</h5>
          <span className='flex items-center justify-center w-7 h-7 rounded-full bg-zinc-600'>
            <MdOutlineFileDownload color='#fff' size=".9em"/>
          </span>
        </div>
        <div className='tag w-full py-4 flex justify-center items-center bg-green-400'>
          <h3 className='text-sm font-semibold'>Downloaded</h3>
        </div>
      </div>
    </div>
  )
}

export default Card