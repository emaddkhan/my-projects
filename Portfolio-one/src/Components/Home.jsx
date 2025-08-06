import React from 'react'
import Navbar from './Navbar'
import LandingPage from './LandingPage'

function Home() {
  return (
    <div id='home' className='h-screen relative w-full'>
      <div className='w-[90%]  mx-auto py-5 px-10 h-full '>
        <Navbar/>
        <LandingPage/>
      </div>
    </div>
  )
}

export default Home