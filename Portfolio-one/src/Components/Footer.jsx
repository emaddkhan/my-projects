import React from 'react'
import mail from "../assets/mail.png"
import linkedin from "../assets/linkedin.png"
import fb from "../assets/fb.png"
import twitter from "../assets/twitter.png"
import insta from "../assets/insta.png"
import github from "../assets/github.png"
function Footer() {
  return (
    <div id='contact' className='w-full h-72 p-1 text-white'>
        <div className='w-[90%] mx-auto px-10 py-3 h-[72.2%] bg-500'>
            <h3 className='text-3xl  font-bold'>Contact Me</h3>
            <div className='h-[34.5%] flex items-center justify-between my-10 w-full bg-black'>
                <div className='h-full w-[31%] rounded-md bg-brand-navGrey px-3 flex justify-between items-center'>
                    <img src={mail} alt="" />
                    <h2 className='text-2xl font-semibold'>emadkhan.yousufzai@gmail.com</h2>
                </div>
                <div className='h-full flex gap-20  w-[47%] '>
                    {[linkedin,fb,twitter,insta,github].map((item,i)=>{
                        return(
                            <div className='w-[10%] bg-brand-navGrey flex items-center justify-center rounded-md h-full'>
                                <img className=' rounded-md' src={item} alt="" />
                            </div>

                        )
                    })}

                </div>
            </div>
        </div>
        <div className='w-full h-20 border-t-2 border-brand-navGrey '>
            <div className='flex justify-between items-center w-[90%] mx-auto h-full bg-black text-white'>
                <h4 className='font-semibold'>2025 © All Right Reserved</h4>
            <h4 className='font-semibold'>Developed By: Emad Khan Yousuf Zai</h4>
            </div>
        </div>
    </div>
  )
}

export default Footer