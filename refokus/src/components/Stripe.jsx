import React from 'react'

function Stripe({value}) {
  return (
    <div className='px-4 py-5 h-16 border-t-[1.2px] border-b-[1.2px] border-r-[1.2px] flex justify-between items-center border-zinc-600 w-[16.66%] '>
      <img src={value.url} alt="" />
      <span className='font-semibold'>{value.number}</span>
    </div>
  )
}

export default Stripe