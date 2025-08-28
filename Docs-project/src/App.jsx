import React, { useState } from 'react'
import Background from './Components/Background'
import Forground from './Components/Forground'
import Form from './Components/Form'

function App() {
  const addBtnHandler=()=>{
    setShowForm(!showForm)
  }
  const formCloseBtnHandeler=()=>{
    setShowForm(false)
  }
  const [showForm,setShowForm]=useState(false)
  return (
    <div className='relative  h-screen w-full bg-zinc-800'>
      <Background/>
      <Forground  addBtnHandler={addBtnHandler}/>
      {showForm&&<Form formCloseBtnHandeler={formCloseBtnHandeler} />}
    </div>
  )
}

export default App