import React from 'react'

function Navbar() {
  return (
    <div className='w-[85.4%] fixed top-5 z-50 h-[9vh] bg-brand-navGrey flex justify-between items-center rounded-full shadow-lg shadow-gray-600/30'>
        <div className='w-[19.5%] flex justify-center items-center'>
            <button className='text-white bg-brand-black font-semibold px-16 py-3 rounded-full'>Download Resume</button>
        </div>
        <div className='w-[29.5%]  flex gap-16 items-center'>
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