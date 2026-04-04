import React from 'react'
import Logo from '../assets/logo.svg'
import Add from '../assets/add.png'
import User from '../assets/user.png'
import { Link } from 'react-router-dom'
import search from '../assets/search.png'
function Navbar() {
  return (
    
    <div className='w-full h-[3.4vw] bg-[#032541] py-3'>
        <div className='navContainer w-[65%] h-full flex justify-between mx-auto px-2 '>
            <div className="navLeft w-[50%] px-2 items-center h-full flex justify-between">
                <Link to={'/'}><img className='h-[1vw]' src={Logo} alt="" /></Link>
                <Link to={'/movies'} className='font-bold text-white'>Movies</Link>
                <Link to={'/tv'} className='font-bold text-white'>Tv Shows</Link>
                <Link to={'/person'} className='font-bold text-white'>People</Link>
                <Link to={'/award'} className='font-bold text-white'>Awards</Link>
            </div>
            <div className="navRight flex justify-between items-center w-[15%] h-full">
              <img className='h-[20px]' src={Add} alt="Add" />
              <div className='p-[.6vw] rounded-full bg-white'><img className='h-[20px]' src={User} alt="User" /></div>
              <img className='h-[25px]' src={search} alt="Search" />

            </div>
        </div>
    </div>
  )
}

export default Navbar