import React from 'react'
import facebook from "../assets/facebook.svg"
import twitter from "../assets/twitter.svg"
import instagram from "../assets/insta.svg"
import linker from "../assets/linker.svg"

const icons =[facebook,twitter,instagram]

function MovieSideBarIcons() {
  return (
    <div className='flex mt-6 bg-amber-20 gap-2 items-center'>
        {
            icons.map((icons,i)=>{
                return(
                    <img src={icons} alt="social media icons" className='w-7 h-7 '/>
                )
            })
        }
        <div className='px-2 border-l-[.05vh] border-gray-300'>
        <img src={linker} alt="social media icons" className='w-7 h-7 rotate-45 '/>

        </div>
    </div>
  )
}

export default MovieSideBarIcons