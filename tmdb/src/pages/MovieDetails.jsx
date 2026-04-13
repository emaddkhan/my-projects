import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { getFullMovieDetails } from '../api/movies';

function MovieDetails() {
    const {id}=useParams();
    const loacation = useLocation();
    const movie = loacation.state;
    const [movieDetails, setMovieDetails] = useState(null);
    useEffect(() => {
        const loadData = async () => {
          try {
            const data = await getFullMovieDetails(id);
            console.log("Movie Details:", data);
            setMovieDetails(data);
          } catch (error) {
            console.error("Error fetching movie details:", error);
          }
        };

        loadData();
      }, [id]);


  return (
    <div>MovieDetails</div>
  )
}

export default MovieDetails