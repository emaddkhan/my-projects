import React from 'react'
import bannerOneImg from '../assets/BannerOne.jpg'
import bannerTwoImg from '../assets/bannerTwo.png'
import bannerThreeImg from '../assets/bannerThree.png'
import HomeSearch from './HomeSearch'

function Banner() {
  const images = [bannerOneImg, bannerTwoImg, bannerThreeImg]

  const randomImage = images[Math.floor(Math.random() * images.length)]
  return (
    <div className="h-[18.8vw] flex justify-center items-center w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${randomImage})` }}>
        <div className="bannerContainer w-[63%] flex flex-col justify-center gap-9 h-full ">
          <div>
          <h1 className='text-[2.5vw] leading-[2.3vw] font-bold text-white'>Welcome.</h1>
          <h3 className='text-[1.7vw] font-semibold text-white'>Millions of movies, TV shows and people to discover. Explore now.</h3>
          </div>
          <HomeSearch/>
          
        </div>
      </div>
  )
}

export default Banner