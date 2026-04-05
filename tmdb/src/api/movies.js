import { fetchDataFromApi } from "./client";

export const getTrendingMovies = () => {
  return fetchDataFromApi("/trending/movie/day"); // trending today
};
export const getMoviesThisWeek = () => {
    return fetchDataFromApi("/trending/movie/week"); // trending this week
}