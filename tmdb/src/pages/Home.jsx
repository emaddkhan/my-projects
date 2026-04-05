import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Banner from "../components/Banner";
import HomeSections from "../components/HomeSections";
import { getInTheatersMovies, getMoviesThisWeek, getOntTv, getPopularMovies, getRentMovies, getTrendingMovies } from "../api/movies";

function Home() {
  const [trendingToday, setTrendingToday] = useState([]);
  const [trendingTodayWeek, setTrendingTodayWeek] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSectionBg, setShowSectionBg] = useState(true);
  const [activeTab, setActiveTab] = useState("day"); 
  const [activeTabSec2, setActiveTabSec2] = useState("streaming"); 
  const [popularMoviesStreaming, setPopularMoviesStreaming] = useState([]);
  const [onTheAirTv, setOnTheAirTv] = useState([]);
  const [rentMovies, setRentMovies] = useState([]);
  const [inTheatersMovies, setInTheatersMovies] = useState([]);
  const tabsSection1 = [
      { label: "Today", value: "day" },
      { label: "This Week", value: "week" }
    ];
    const tabsSection2 = [
      { label: "Streaming", value: "streaming" },
      { label: "On Tv", value: "tv" },
      { label: "For Rent", value: "rent" },
      { label: "In Theaters", value: "theaters" }
    ];
  const sectionTitles =["Trending","What's Popular","Free To Watch"]; 
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
useEffect(()=>{
  const loadPopularStreamingMovies=async()=>{
    try{
      setLoading(true);
      const data=await getPopularMovies();
      setPopularMoviesStreaming(data?.results || []);
    } catch (error) {
      console.error("Error fetching popular streaming movies:", error);
      setPopularMoviesStreaming([]);
    } finally {
      setLoading(false);
    }
  }
  loadPopularStreamingMovies();
},[])
useEffect(()=>{
  const loadOnTheAirTv=async()=>{
    try{
      setLoading(true);
      const data=await getOntTv();
      console.log("On The Air TV Shows:", data.results);
      setOnTheAirTv(data?.results || []);
    } catch (error) {
      console.error("Error fetching on the air TV shows:", error);
      setOnTheAirTv([]);
    } finally {
      setLoading(false);
    }
  }
  loadOnTheAirTv();
},[])
useEffect(()=>{
  const loadRentMovies=async()=>{
    try{
      setLoading(true);
      const data=await getRentMovies();
      console.log("Rent Movies:", data.results);
      setRentMovies(data?.results || []);
    } catch (error) {
      console.error("Error fetching rent movies:", error);
      setRentMovies([]);
    } finally {
      setLoading(false);
    }
  }
  loadRentMovies();
},[])

useEffect(()=>{
  const loadInTheatersMovies=async()=>{
    try{
      setLoading(true);
      const data=await getInTheatersMovies();
      console.log("In Theaters Movies:", data.results);
      setInTheatersMovies(data?.results || []);
    } catch (error) {
      console.error("Error fetching in theaters movies:", error);
      setInTheatersMovies([]);
    } finally {
      setLoading(false);
    }
  }
  loadInTheatersMovies();
},[])

  const moviesToShow = activeTab === 'day' ? trendingToday : trendingTodayWeek;
  const moviesToShowSec2 = activeTabSec2 === 'streaming' ? popularMoviesStreaming : activeTabSec2 === 'tv' ? onTheAirTv : activeTabSec2 === 'rent' ? rentMovies : inTheatersMovies;
  return (
    <div className="h-screen relative w-full">
      <div className="fixed w-full z-10">
        <Navbar />
        <Search />
      </div>
      <div className="pt-[5.8vw]"><Banner /></div>
      <HomeSections tabs={tabsSection1} sectionTitles={sectionTitles[0]} showSectionBg={showSectionBg} activeTab={activeTab} setActiveTab={setActiveTab} moviesToShow={moviesToShow} />
      <HomeSections tabs={tabsSection2} sectionTitles={sectionTitles[1]}  activeTab={activeTabSec2} setActiveTab={setActiveTabSec2} moviesToShow={moviesToShowSec2} />
    </div>
  );
}

export default Home;
