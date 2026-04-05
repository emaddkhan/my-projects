import { fetchDataFromApi } from "./client";

export const getTrendingMovies = fetchDataFromApi("/trending/movie/week");