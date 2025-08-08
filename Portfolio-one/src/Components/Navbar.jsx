import React from 'react'
import "../css/home.css"

function Navbar() {
  return (
    <div className='nav w-[85.4%] fixed top-5 z-50 h-[9vh] bg-brand-navGrey flex justify-between items-center rounded-full shadow-lg shadow-gray-600/30'>
        <div className='download w-[19.5%] flex justify-center items-center'>
            <a href='/Profile.pdf' download className='text-white downloadBtn bg-brand-black font-semibold px-16 py-3 rounded-full'>Download Resume</a>
        </div>
        <div className='w-[29.5%] links flex gap-16 items-center'>
            {[{name:"Home",link:"#home"},{name:"About",link:"#about"},{name:"Projects",link:"#work"},{name:"Contacts",link:"#contact"}].map((item,index)=>{
                return(
                    <a className='text-white font-semibold' href={item.link}>{item.name}</a>
                )
            })}
        </div>
    </div>
  )
}

export default Navbar