import React from 'react'

function NavElem() {
  return (
    <div className='flex justify-between mr-4'>{
        ['Home','AboutMe','Contact'].map((item,e)=>{
            return (
                <a  className='text-xl cursor-pointer hover:text-brand-cyan text-brand-white'>{item}</a>
            )
        })
    }</div>
  )
}

export default NavElem