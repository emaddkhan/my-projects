import React from 'react'
import Navbar from './components/Navbar'
import Work from './components/Work'
import Stripes from './components/Stripes'
import Products from './components/Products'
import Marques from './components/Marques'
import Cards from './components/Cards'

function App() {
  return (
    <div className='h-full  w-full bg-[#1C1C1C] text-white'>
      <Navbar/>
      <Work/>
      <Stripes/>
      <Products/>
      <Marques/>
      <Cards/>
    </div>
  )
}

export default App