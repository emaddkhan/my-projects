import React from 'react'
import { BsArrowReturnRight } from "react-icons/bs";

function Button() {
  return (
    <div className='min-w-40 px-3 py-2 flex items-center justify-between bg-zinc-100 rounded-full text-black'>
        <span className='text-sm font-medium'>Get Started</span>
        <BsArrowReturnRight/>
    </div>
  )
}

export default Button