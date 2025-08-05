import React from 'react'

function Navbar() {
  return (
    <div className='w-full h-[9vh] bg-brand-navGrey flex justify-between items-center rounded-full'>
        <div className='w-[19.5%] flex justify-center items-center'>
            <button className='text-white bg-brand-black font-semibold px-16 py-3 rounded-full'>Download Resume</button>
        </div>
        <div className='w-[29.5%]  flex gap-16 items-center'>
            {["Home","About","Projects","Contacts"].map((item,index)=>{
                return(
                    <a className='text-white font-semibold' href="">{item}</a>
                )
            })}
        </div>
    </div>
  )
}

export default Navbar