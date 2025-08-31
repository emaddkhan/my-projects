import React, { useState } from 'react'
import Background from './Components/Background'
import Forground from './Components/Forground'
import Form from './Components/Form'

function App() {
  
  const [backgroundMainColor, setBackgroundMainColor] = useState(() => {
    return localStorage.getItem("backgroundMainColor") || "#27272A";
  });
  const [backgroundMainFontColor, setBackgroundMainFontColor] = useState(() => {
    return localStorage.getItem("backgroundMainFontColor") || "#18181B";
  });
  const [showForm,setShowForm]=useState(false)
  return (
    <div className='relative  h-screen w-full bg-zinc-800 ' style={{backgroundColor:backgroundMainColor}}>
      <Background backgroundMainFontColor={backgroundMainFontColor} />
      <Forground backgroundMainColor={backgroundMainColor} backgroundMainFontColor={backgroundMainFontColor} setBackgroundMainFontColor={setBackgroundMainFontColor} setBackgroundMainColor={setBackgroundMainColor}/>
      {showForm&&<Form formCloseBtnHandeler={formCloseBtnHandeler} />}
    </div>
  )
}

export default App