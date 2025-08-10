import React from 'react'
import Navbar from './Navbar'
import LandingPage from './LandingPage'
import "../css/home.css"

function Home() {
  return (
    <div id='home' className='h-screen home relative w-full'>
      <div className='w-[90%] homeContainer  mx-auto py-5 px-10 h-full '>
        <Navbar/>
        <LandingPage/>
      </div>
    </div>
  )
}

export default Home