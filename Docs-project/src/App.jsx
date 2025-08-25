import React from 'react'
import Background from './Components/Background'
import Forground from './Components/Forground'

function App() {
  return (
    <div className='relative  h-screen w-full bg-zinc-800'>
      <Background/>
      <Forground/>
    </div>
  )
}

export default App