import React from 'react'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import AboutMe from './components/AboutMe'
import Work from './components/Work'
import Form from './components/Form'

function App() {
  return (
    <div className='w-full h-full bg-brand-blue flex justify-center'>
      <div className=' w-full h-full '>
        <Navbar/>
        <LandingPage/>
        <AboutMe/>
        <Work/>
        <Form/>
      </div>
    </div>
  )
}

export default App