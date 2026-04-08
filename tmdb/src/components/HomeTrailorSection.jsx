import React from 'react'
import TrailorSectionDisplay from './TrailorSectionDisplay'

function HomeTrailorSection({tabs, activeTab,moviesToShow, setActiveTab}) {
  return (
    <div className='h-[39vh] pt-5 w-full bg-blue-500'>
        <TrailorSectionDisplay tabs={tabs} activeTab={activeTab} moviesToShow={moviesToShow} setActiveTab={setActiveTab}/>

    </div>
  )
}

export default HomeTrailorSection