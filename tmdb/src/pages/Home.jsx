import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Banner from "../components/Banner";
import HomeSections from "../components/HomeSections";
import {
  getInTheatersMovies,
  getInTheatersTrailorMovies,
  getLatestOnTvTrailor,
  getLatestStreamingMovies,
  getMoviesThisWeek,
  getMovieTheatorsVideos,
  getOnRentTrailorMovieVideos,
  getOntTv,
  getPopularMovies,
  getPopularTrailorMoviesVideos,
  getPopularTrailorsMovies,
  getRentMovies,
  getRentMoviesTrailor,
  getTrendingMovies,
  getTvVideos,
} from "../api/movies";
import { IMAGE_BASE_URL } from "../api/config";

function Home() {
  const [trendingToday, setTrendingToday] = useState([]);
  const [trendingTodayWeek, setTrendingTodayWeek] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSectionBg, setShowSectionBg] = useState(true);
  const [showSection3Bg, setShowSection3Bg] = useState(null);
  const [showSection3Color, setShowSection3Color] = useState(true);
  const [activeTab, setActiveTab] = useState("day");
  const [activeTabSec2, setActiveTabSec2] = useState("streaming");
  const [activeTabSec3, setActiveTabSec3] = useState("popular");
  const [popularMoviesStreaming, setPopularMoviesStreaming] = useState([]);
  const [onTheAirTv, setOnTheAirTv] = useState([]);
  const [rentMovies, setRentMovies] = useState([]);
  const [inTheatersMovies, setInTheatersMovies] = useState([]);
  const [popularMoviesTrailors, setPopularMoviesTrailors] = useState([]);
  const [streamingTrailorMovies, setStreamingTrailorMovies] = useState([]);
  const [OnTvTrailorMovies, setOnTvTrailorMovies] = useState([]);
  const [onRentTrailorMovies, setOnRentTrailorMovies] = useState([]);
  const [onTheatersTrailorMovies, setInTheatersTrailorMovies] = useState([]);

  const tabsSection1 = [
    { label: "Today", value: "day" },
    { label: "This Week", value: "week" },
  ];
  const tabsSection2 = [
    { label: "Streaming", value: "streaming" },
    { label: "On Tv", value: "tv" },
    { label: "For Rent", value: "rent" },
    { label: "In Theaters", value: "theaters" },
  ];
  const tabsSection3 = [
    { label: "Popular", value: "popular" },
    { label: "Streaming", value: "streaming" },
    { label: "On Tv", value: "tv" },
    { label: "For Rent", value: "rent" },
    { label: "In Theaters", value: "theaters" },
  ];
  const sectionTitles = [
    "Trending",
    "Latest Trailers",
    "What's Popular",
    "Free To Watch",
  ];
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
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await getMoviesThisWeek();
        console.log("weekTrending:", data);
        setTrendingTodayWeek(data?.results || []);
      } catch (error) {
        console.error("Error fetching weekly movies:", error);
        setTrendingTodayWeek([]);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);
  useEffect(() => {
    const loadPopularStreamingMovies = async () => {
      try {
        setLoading(true);
        const data = await getPopularMovies();
        setPopularMoviesStreaming(data?.results || []);
      } catch (error) {
        console.error("Error fetching popular streaming movies:", error);
        setPopularMoviesStreaming([]);
      } finally {
        setLoading(false);
      }
    };
    loadPopularStreamingMovies();
  }, []);
  useEffect(() => {
    const loadOnTheAirTv = async () => {
      try {
        setLoading(true);
        const data = await getOntTv();
        console.log("On The Air TV Shows:", data.results);
        setOnTheAirTv(data?.results || []);
      } catch (error) {
        console.error("Error fetching on the air TV shows:", error);
        setOnTheAirTv([]);
      } finally {
        setLoading(false);
      }
    };
    loadOnTheAirTv();
  }, []);
  useEffect(() => {
    const loadRentMovies = async () => {
      try {
        setLoading(true);
        const data = await getRentMovies();
        console.log("Rent Movies:", data.results);
        setRentMovies(data?.results || []);
      } catch (error) {
        console.error("Error fetching rent movies:", error);
        setRentMovies([]);
      } finally {
        setLoading(false);
      }
    };
    loadRentMovies();
  }, []);

  useEffect(() => {
    const loadInTheatersMovies = async () => {
      try {
        setLoading(true);
        const data = await getInTheatersMovies();
        console.log("In Theaters Movies:", data.results);
        setInTheatersMovies(data?.results || []);
      } catch (error) {
        console.error("Error fetching in theaters movies:", error);
        setInTheatersMovies([]);
      } finally {
        setLoading(false);
      }
    };
    loadInTheatersMovies();
  }, []);
  //trailors section code streaming and popular movies
  useEffect(() => {
    const loadPopularTrailors = async () => {
      try {
        setLoading(true);

        const data = await getPopularTrailorsMovies();

        // 👇 sirf top 8 movies (performance ke liye)
        const movies = data.results.slice(0, 20);
        console.log("Popular Movies for Trailers:", movies);

        const moviesWithTrailers = await Promise.all(
          movies.map(async (movie) => {
            const videoData = await getPopularTrailorMoviesVideos(movie.id);

            const trailer = videoData.results.find(
              (v) => v.type === "Trailer" && v.site === "YouTube",
            );

            return {
              ...movie,
              trailerKey: trailer?.key || null,
            };
          }),
        );

        console.log("Movies with trailers:", moviesWithTrailers);
        setPopularMoviesTrailors(moviesWithTrailers);
         if (moviesWithTrailers[0]?.backdrop_path) {
        setShowSection3Bg(`${IMAGE_BASE_URL}${moviesWithTrailers[0].backdrop_path}`);

      }
      } catch (error) {
        console.error("Error fetching trailers:", error);
        setPopularMoviesTrailors([]);
      } finally {
        setLoading(false);
      }
    };

    loadPopularTrailors();
  }, []);
  useEffect(() => {
  const loadStreamingTrailorMovies = async () => {
    try {
      setLoading(true);

      const data = await getLatestStreamingMovies();
      const movies = data.results.slice(0, 20) || [];

      const moviesWithTrailor = await Promise.all(
        movies.map(async (movie) => {
          const videoData = await getPopularTrailorMoviesVideos(movie.id);

          const trailer = videoData.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );

          return {
            ...movie,
            trailerKey: trailer?.key || null,
          };
        })
      );

      const filteredMoviesWithTrailor = moviesWithTrailor.filter(
        (movie) => movie.trailerKey
      );

      console.log("Streaming Movies with Trailers:", filteredMoviesWithTrailor);

      setStreamingTrailorMovies(filteredMoviesWithTrailor);

    } catch (error) {
      console.error("Error fetching streaming trailers:", error);
      setStreamingTrailorMovies([]);
    } finally {
      setLoading(false);
    }
  };

  loadStreamingTrailorMovies(); 
}, []);
//on tvvvv
  useEffect(() => {
  const loadOnTvTrailor = async () => {
    try {
      setLoading(true);

      const data = await getLatestOnTvTrailor();
      const movies = data.results.slice(0, 20) || [];

      const moviesWithTrailor = await Promise.all(
        movies.map(async (movie) => {
          const videoData = await getTvVideos(movie.id);

          const trailer = videoData.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );

          return {
            ...movie,
            trailerKey: trailer?.key || null,
          };
        })
      );

      const filteredMoviesWithTrailor = moviesWithTrailor.filter(
        (movie) => movie.trailerKey
      );

      console.log("Streaming Movies with Trailers:", filteredMoviesWithTrailor);

      setOnTvTrailorMovies(filteredMoviesWithTrailor);

    } catch (error) {
      console.error("Error fetching on TV trailers:", error);
      setOnTvTrailorMovies([]);
    } finally {
      setLoading(false);
    }
  };

  loadOnTvTrailor(); 
}, []);
//On Rent Trailor code
 useEffect(() => {
  const loadOnRentTrailor = async () => {
    try {
      setLoading(true);

      const data = await getRentMoviesTrailor();
      const movies = data.results.slice(0, 20) || [];

      const moviesWithTrailor = await Promise.all(
        movies.map(async (movie) => {
          const videoData = await getOnRentTrailorMovieVideos(movie.id);

          const trailer = videoData.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );

          return {
            ...movie,
            trailerKey: trailer?.key || null,
          };
        })
      );

      const filteredMoviesWithTrailor = moviesWithTrailor.filter(
        (movie) => movie.trailerKey
      );

      console.log("Streaming Movies with Trailers:", filteredMoviesWithTrailor);

      setOnRentTrailorMovies(filteredMoviesWithTrailor);

    } catch (error) {
      console.error("Error fetching on TV trailers:", error);
      setOnRentTrailorMovies([]);
    } finally {
      setLoading(false);
    }
  };

  loadOnRentTrailor(); 
}, []);
//on theaters trailor code
useEffect(() => {
  const loadInTheaterTrailor = async () => {
    try {
      setLoading(true);

      const data = await getInTheatersTrailorMovies();
      const movies = data.results.slice(0, 20) || [];

      const moviesWithTrailor = await Promise.all(
        movies.map(async (movie) => {
          const videoData = await getMovieTheatorsVideos(movie.id);

          const trailer = videoData.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );

          return {
            ...movie,
            trailerKey: trailer?.key || null,
          };
        })
      );

      const filteredMoviesWithTrailor = moviesWithTrailor.filter(
        (movie) => movie.trailerKey
      );

      console.log("Streaming Movies with Trailers:", filteredMoviesWithTrailor);

      setInTheatersTrailorMovies(filteredMoviesWithTrailor);

    } catch (error) {
      console.error("Error fetching on TV trailers:", error);
      setInTheatersTrailorMovies([]);
    } finally {
      setLoading(false);
    }
  };

  loadInTheaterTrailor(); 
}, []);
  const moviesToShow = activeTab === "day" ? trendingToday : trendingTodayWeek;
  const moviesToShowSec2 =
    activeTabSec2 === "streaming"
      ? popularMoviesStreaming
      : activeTabSec2 === "tv"
        ? onTheAirTv
        : activeTabSec2 === "rent"
          ? rentMovies
          : inTheatersMovies;
  return (
    <div className="h-screen relative w-full">
      <div className="fixed w-full z-30">
        <Navbar />
        <Search />
      </div>
      <div className="pt-[5.8vw]">
        <Banner />
      </div>
      <HomeSections
        tabs={tabsSection1}
        sectionTitles={sectionTitles[0]}
        showSectionBg={showSectionBg}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        moviesToShow={moviesToShow}
      />
      <HomeSections
        tabs={tabsSection3}
        sectionTitles={sectionTitles[1]}
        showSection3Bg={showSection3Bg}
        setShowSection3Bg={setShowSection3Bg}
        activeTab={activeTabSec3}
        setActiveTab={setActiveTabSec3}
        moviesToShow={inTheatersMovies}
        showSection3Color={showSection3Color}
      />
      <HomeSections
        tabs={tabsSection2}
        sectionTitles={sectionTitles[2]}
        activeTab={activeTabSec2}
        setActiveTab={setActiveTabSec2}
        moviesToShow={moviesToShowSec2}
      />
    </div>
  );
}

export default Home;
