import React from 'react'
import Button from './Button'

function Product({val,mover,index}) {
  return (
    <div className='w-full h-[23rem] py-20'>
      <div onMouseEnter={()=>{mover(index)}} className='max-w-screen-xl mx-auto flex justify-between items-center'>
        <h1 className='text-6xl font-medium capitalize'>{val.title}</h1>
        <div className='dets w-1/3'>
          <p className='mb-7 text-xl'>{val.description}</p>
          <div className='flex items-center gap-5'>
            {val.live&&<Button title='live Websites'/>}
          {val.case&&<Button title='Case Study'/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product