import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getPopularPeople } from '../api/movies';

function Person() {

  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getPopularPeople();
      console.log("Popular People Data:", data?.results);
    } catch (error) {
      console.error("Error fetching popular people data", error);
    }
  };

  fetchData();
}, []);
  return (
    <div>
      <Navbar />
      <div className='container w-[63%] mx-auto py-5  bg-amber-200'>
        <h2 className='text-xl font-bold'>Popular People</h2>
      </div>
    </div>
  )
}

export default Person