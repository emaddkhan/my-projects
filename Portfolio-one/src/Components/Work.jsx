import React from 'react'
import movie from "../assets/frame2.png"
import wheather from "../assets/frame-3.png"
import bdh from "../assets/Frame4.png"
import database from "../assets/frame5.png"
import sab from "../assets/frame6.png"
import { motion } from "framer-motion";
import movie2 from "../assets/Frame 1.png"

function Work() {
  return (
    <div className='w-full h-screen'>
        <div className='w-[90%]  mx-auto py-5 px-10 h-full'>
            <div className=' w-full h-full'>
                <h3 className='text-3xl mt-3 font-bold text-white'>My Projects</h3>
                <div className='w-full h-[46%] bg-brand-navGrey px-4 mt-5 rounded-2xl'>
                    <h3 className='text-white font-semibold py-5 text-2xl mt-2'>Development Projects</h3>

                    <div className='w-full h-[71%] flex gap-5  overflow-hidden whitespace-nowrap py-1 '>
                        {[
                            {img:movie,name:"Movie Web App"},
                            {img:wheather,name:"Weather Web App"},
                            {img:bdh,name:"BDH Website"},
                            {img:database,name:"Mortuary Database Web App"},
                            {img:sab,name:"SAB Website"},
                            {img:movie2,name:"Movie Web App"}
                        ].map((item,i)=>{
                            return(
                                <div className='w-[30%] shrink-0 p-1 h-full bg-brand-paragrey rounded-lg'>
                            <img className='h-[90%] object-cover object-center rounded-md' src={item.img} alt="" />
                            <h4 className='font-semibold text-white text-center'>{item.name}</h4>
                        </div> 
                            )
                        })
                        }
                                             
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Work