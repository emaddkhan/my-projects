import React from 'react'
import Home from './Components/Home'
import About from './Components/About'
import Work from './Components/Work'
import Footer from './Components/Footer'
import MouseFollower from './Components/MouseFollower'

function App() {
  return (
    <div className=' bg-brand-black relative'>
      <MouseFollower/>
      <Home/>
      <About/>
      <Work/>
      <Footer/>

    </div>
  )
}

export default App