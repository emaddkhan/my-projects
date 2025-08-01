import React from 'react'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'

function App() {
  return (
    <div className='w-full h-full bg-brand-blue flex justify-center'>
      <div className=' w-full h-full '>
        <Navbar/>
        <LandingPage/>
      </div>
    </div>
  )
}

export default App