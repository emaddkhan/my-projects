import React from 'react'
import TrailorSectionDisplay from './TrailorSectionDisplay'

function HomeTrailorSection({tabs,setTrailorLoading,setVideoKey,setShowSection3Bg,showSection3Bg, activeTab,moviesToShow, setActiveTab}) {
  return (
    <div style={{ backgroundImage: `url(${showSection3Bg})`, backgroundRepeat:'no-repeat' ,backgroundSize:'cover',backgroundPositionY:'20%'}} className='transition-all duration-1000 ease-in-out h-[40vh] pt-5 w-full bg-[#032541c7] bg-blend-multiply'>
        <TrailorSectionDisplay setTrailorLoading={setTrailorLoading} setVideoKey={setVideoKey} setShowSection3Bg={setShowSection3Bg} tabs={tabs} activeTab={activeTab} moviesToShow={moviesToShow} setActiveTab={setActiveTab}/>

    </div>
  )
}

export default HomeTrailorSection