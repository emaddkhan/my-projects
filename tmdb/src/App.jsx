import { Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Person from './pages/Person'
import Award from './pages/Award'
import Tv from './pages/Tv'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'

function App() {

  return (
    <div className='h-screen w-full'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/movies' element={<Movies/>}/>
        <Route path='/tv' element={<Tv/>}/>
        <Route path='/person' element={<Person/>}/>
        <Route path='/award' element={<Award/>}/>
        <Route path='/movie/:id' element={<MovieDetails/>}/>
      </Routes>
    </div>
    
  )
}

export default App
