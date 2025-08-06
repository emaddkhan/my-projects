import React from 'react'
import Home from './Components/Home'
import About from './Components/About'
import Work from './Components/Work'
import Footer from './Components/Footer'

function App() {
  return (
    <div className=' bg-brand-black'>
      <Home/>
      <About/>
      <Work/>
      <Footer/>
    </div>
  )
}

export default App