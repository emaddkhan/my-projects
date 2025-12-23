import React from 'react'
import Videos from '../Components/home/Videos'
import HomeHeroBottomText from '../Components/home/HomeHeroBottomText'
import HomeHeroTopText from '../Components/home/HomeHeroTopText'

function Home() {
  return (
    <div>
      <div className='w-screen h-screen fixed   '>
        <Videos/>
      </div>
      <div className='h-screen w-screen justify-between relative flex flex-col'>
        <HomeHeroTopText/>
        <HomeHeroBottomText/>

      </div>
    </div>
  )
}

export default Home