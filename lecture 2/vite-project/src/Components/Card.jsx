import React from 'react'

function Card({values,favHandler,index,activeColor}) {
  const {img,song,artist,added} =values
  return (
    <div className='w-72 p-2 bg-zinc-200 py-3 rounded-md flex gap-5 relative pb-8 mt-10'>
      <div className='h-28 rounded-md bg-orange-500 overflow-hidden w-28'>
        <img className='h-full w-full object-cover' src={img} alt="" />
      </div>
      <div>
        <h1 className='font-semibold text-xl leading-none'>{song}</h1>
        <h3>{artist}</h3>
      </div>
      <div onClick={()=>favHandler(index)} className={`cursor-pointer absolute px-3 py-2 rounded-full ${added?"bg-teal-500":activeColor||"bg-blue-500"} text-white bottom-0 left-1/2 -translate-x-[50%] translate-y-[50%]`}>
        <h3>{added?"Added":"Add to favorite"}</h3>
      </div>
    </div>
  )
}

export default Card