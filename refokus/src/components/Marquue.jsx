import React from 'react'

function Marquue({images}) {
  return (
    <div className='flex w-full gap-28 py-8 overflow-hidden whitespace-nowrap '>
      {images.map((url)=><img src={url} className='flex-shrink-0 w-[6vw]'/>)}
      {images.map((url)=><img src={url} className='flex-shrink-0 w-[6vw]'/>)}
    </div>
  )
}

export default Marquue