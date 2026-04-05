import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Banner from "../components/Banner";
import HomeSections from "../components/HomeSections";
import { getMoviesThisWeek, getTrendingMovies } from "../api/movies";

function Home() {
  const [trendingToday, setTrendingToday] = useState([]);
  const [trendingTodayWeek, setTrendingTodayWeek] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("day"); // 0 for Today, 1 for This Week


useEffect(() => {
  const loadMovies = async () => {
    try {
      setLoading(true);

      const data = await getTrendingMovies();
      console.log("data:", data);

      if (data && data.results) {
        setTrendingToday(data.results);
        console.log("Trending Today Movies:", data.results);
      } else {
        setTrendingToday([]);
      }

    } catch (error) {
      console.error("Error fetching movies:", error);
      setTrendingToday([]);
    } finally {
      setLoading(false);
    }
  };

  loadMovies();
}, []);
useEffect(()=>{
  const loadMovies=async()=>{
    try{
      setLoading(true);
      const data =await getMoviesThisWeek();
      console.log("weekTrending:",data);
      setTrendingTodayWeek(data?.results || []);
    } catch (error) {
      console.error("Error fetching weekly movies:", error);
      setTrendingTodayWeek([]);
    } finally {
      setLoading(false);
    }

  }
  loadMovies();
},[])
  const moviesToShow = activeTab === 'day' ? trendingToday : trendingTodayWeek;
  return (
    <div className="h-screen relative w-full">
      <div className="fixed w-full z-10">
        <Navbar />
        <Search />
      </div>
      <div className="pt-[5.8vw]"><Banner /></div>
      <HomeSections activeTab={activeTab} setActiveTab={setActiveTab} moviesToShow={moviesToShow} />
    </div>
  );
}

export default Home;
