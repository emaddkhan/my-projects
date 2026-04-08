import { fetchDataFromApi } from "./client";

export const getTrendingMovies = () => {
  return fetchDataFromApi("/trending/movie/day"); // trending today
};
export const getMoviesThisWeek = () => {
    return fetchDataFromApi("/trending/movie/week"); // trending this week
}
export const getPopularMovies = () => {
  return fetchDataFromApi("/movie/popular");
}

export const getOntTv =()=>{
  return fetchDataFromApi("/tv/on_the_air");
}
export const getRentMovies = () => {
  return fetchDataFromApi("/discover/movie?with_watch_monetization_types=rent&watch_region=DE");
};
export const getInTheatersMovies = () => {
  return fetchDataFromApi("/movie/now_playing");
};
export const getPopularTrailorsMovies = () => {
  return fetchDataFromApi("/movie/upcoming");
}
export const getPopularTrailorMoviesVideos = (id) => {
  return fetchDataFromApi(`/movie/${id}/videos`);
}
export const getLatestStreamingMovies = () => {
  return fetchDataFromApi(
    "/discover/movie?with_watch_monetization_types=flatrate&sort_by=release_date.desc&watch_region=DE"
  );
};

export const getLatestOnTvTrailor = () => {
  return fetchDataFromApi("/tv/on_the_air");
};
export const getTvVideos = (id) => {
  return fetchDataFromApi(`/tv/${id}/videos`);
};
export const getRentMoviesTrailor = () => {
  return fetchDataFromApi(
    "/discover/movie?with_watch_monetization_types=rent&watch_region=DE&sort_by=popularity.desc"
  );
};
export const getOnRentTrailorMovieVideos = (id) => {
  return fetchDataFromApi(`/movie/${id}/videos`);
};

export const getInTheatersTrailorMovies = () => {
  return fetchDataFromApi("/movie/now_playing");
};
export const getMovieTheatorsVideos = (id) => {
  return fetchDataFromApi(`/movie/${id}/videos`);
};
export const getFreeToWatchMovies = () => {
  return fetchDataFromApi(
    "/discover/movie?with_watch_monetization_types=free"
  );
};
export const getOnTvShows = () => {
  return fetchDataFromApi(
    "/discover/tv?with_watch_monetization_types=flatrate&watch_region=US"
  );
};