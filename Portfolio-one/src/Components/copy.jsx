import React from 'react'

function Navbar() {
  return (
    <div className='md:w-[60%] sm:w-[50%] md:h-[8vh] sm:h-[7vh] lg:w-[85.4%] fixed top-5 z-50 lg:h-[9vh] bg-brand-navGrey flex justify-between items-center rounded-full shadow-lg shadow-gray-600/30'>
        <div className='lg:w-[32%] sm:w-[34.8%]  md:w-[36%] 2xl:w-[19.5%] xl:w-[26.4%] flex justify-center items-center'>
            <a href='/Profile.pdf' download className='text-white sm:text-sm bg-brand-black font-semibold sm:px-5 md:px-8 lg:px-16  py-3 rounded-full'>Download Resume</a>
        </div>
        <div className='2xl:w-[29.5%] hidden md:flex lg:flex xl:flex 2xl:flex md:gap-5 md:w-[48%] lg:w-[37%] lg:gap-8 xl:gap-12   2xl:gap-16 items-center'>
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