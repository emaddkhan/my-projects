import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getFullMovieDetails, getMovieWatchProviders } from "../api/movies";
import Navbar from "../components/Navbar";
import MovieDetailBanner from "../components/MovieDetailBanner";
import VideoPlayer from "../components/VideoPlayer";
import MovieDetailCastSection from "../components/MovieDetailCastSection";
import MovieDetailContainer from "../components/movieDetailContainer";



function MovieDetails() {
  const { id } = useParams();
  const loacation = useLocation();
  const movie = loacation.state;
  const [movieDetails, setMovieDetails] = useState(null);
  const [movieProvider, setMovieProvider] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [trailorLoading, setTrailorLoading] = useState(false);
  
  
  
  
  
  // useEffect(() => {

  //   const loadData = async () => {
  //     try {
  //       const data = await getFullMovieDetails(id);
  //       const pros = await getMovieWatchProviders(id);
  //       setMovieDetails(data);
  //       setMovieProvider(pros);
  //     } catch (error) {
  //       console.error("Error fetching movie details:", error);
  //     }
  //   };

  //   loadData();
  // }, [id]);
//   useEffect(() => {
//   const loadData = async () => {
//     try {
//       const [data, pros] = await Promise.all([
//         getFullMovieDetails(id),
//         getMovieWatchProviders(id),
//       ]);

//       setMovieDetails(data);

//       const getProviders = (pros) => {
//   if (!pros?.results) return null;

//   return (
//     pros.results.PK ||
//     pros.results.US ||
//     pros.results.GB ||
//     Object.values(pros.results).find(Boolean) ||
//     null
//   );
// };
//       setMovieProvider(getProviders(pros));
//     } catch (error) {
//       console.error("Error fetching movie details:", error);
//     }
//   };

//   loadData();
// }, [id]);
useEffect(() => {
  const loadData = async () => {
    try {
      const [data, pros] = await Promise.all([
        getFullMovieDetails(id),
        getMovieWatchProviders(id),
      ]);

      setMovieDetails(data);
      setMovieProvider(getProviders(pros));
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  loadData();
}, [id]);
const getProviders = (pros) => {
  if (!pros?.results) return null;

  return (
    pros.results.PK ||
    pros.results.US ||
    pros.results.GB ||
    Object.values(pros.results).find(Boolean) ||
    null
  );
};
console.log("moviP",movieProvider)
  return (
    <div>
      <div className="fixed z-40 w-full">
        <Navbar />
      </div>
      <div className="pt-[3.4vw] ">
        <MovieDetailBanner setTrailorLoading={setTrailorLoading} setVideoKey={setVideoKey} movie={movieDetails} />
      </div>
         <VideoPlayer videoKey={videoKey} trailorLoading={trailorLoading} setVideoKey={setVideoKey}/>
      <div className="w-full  py-1">
        {movieProvider && (
        <MovieDetailContainer movie={movieDetails} movieProvider={movieProvider} />

        )}
      </div>

    </div>
  );
}

export default MovieDetails;
