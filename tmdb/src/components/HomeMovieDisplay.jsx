import React from 'react';
import MovieCard from './MovieCard';
import '../../src/index.css';

function HomeMovieDisplay({movies}) {
  return (
    <div className="relative w-full p-1 pb-9">
      
      {/* Horizontal scroll container */}
      <div className="flex items-center gap-4 overflow-x-auto horizontal-scroll relative pb-8 z-10">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p>No trending movies available.</p>
        )}
      </div>

      {/* Right side shadow */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white via-white/50 to-transparent z-20"></div>

    </div>
  );
}

export default HomeMovieDisplay;