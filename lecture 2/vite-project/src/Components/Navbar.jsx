import React, { use, useState } from 'react'

function Navbar({data,clr,clrHandler,activeColor}) {
  return (
    <div className='flex px-20 py-3 items-center justify-between'>
        <h3 className=' flex gap-2 font-semibold text-xl'>
          {clr.map((item,index)=>{
            return(
              <div onClick={()=>clrHandler(index)} key={index} className={`h-7 cursor-pointer w-7 rounded-full ${item.colorCode}`}></div>
            )
          })}
        </h3>
        <div className={`flex items-center gap-2 px-4 py-2 ${activeColor ||"bg-blue-600"} rounded-md text-xl text-white font-semibold`}>
            <h3>Favorite</h3>
            <h5>{data.filter(item=>item.added).length}</h5>
        </div>
    </div>
  )
}

export default Navbar