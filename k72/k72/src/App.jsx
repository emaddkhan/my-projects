import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import Agency from "./pages/Agency"
import Work from './pages/Work'
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/agency' element={<Agency/>} />
        <Route path='/projects' element={<Work/>} />
      </Routes>
    </div>
  )
}

export default App