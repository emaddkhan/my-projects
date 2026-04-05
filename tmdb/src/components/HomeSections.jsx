import React, { useEffect, useState } from 'react'
import InnerNav from './InnerNav'
import HomeMovieDisplay from './HomeMovieDisplay'
import { getTrendingMovies } from '../api/movies';

function HomeSections() {
  const [trendingToday, setTrendingToday] = useState([]);
  useEffect(() => {
    const loadMovies=async()=>{
      const data =getTrendingMovies();
      setTrendingToday(data?.results || []);
    }
    loadMovies();
  },[])
  console.log(trendingToday);
  return (
    <div className=' py-7 w-full'>
        <div className="sectionContainer w-[63%] mx-auto h-full ">
            <div className='sectionUpper flex items-center gap-6' >
                <h2 className='text-[1.2vw] font-semibold '>Trending</h2>
                <InnerNav />
            </div>
            <HomeMovieDisplay/>
        </div>
    </div>
  )
}

export default HomeSections