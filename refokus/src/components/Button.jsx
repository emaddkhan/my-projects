import React from 'react'
import { BsArrowReturnRight } from "react-icons/bs";

function Button({title="Get started"}) {
  return (
    <div className='w-[140px] px-3 py-2 flex items-center justify-between bg-zinc-100 rounded-full text-black'>
        <span className='text-sm font-medium'>{title}</span>
        <BsArrowReturnRight/>
    </div>
  )
}

export default Button