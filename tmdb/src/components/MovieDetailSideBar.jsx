import React from "react";
import MovieWatchBtn from "./MovieWatchBtn";
import MovieSideBarIcons from "./MovieSideBarIcons";
import MovieSideBarDetails from "./movieSideBarDetails";

function MovieDetailSideBar({ bgColor, movieProvider, movie }) {
  const getContentScore = (movie) => {
    const rating = movie?.vote_average; // 0 - 10
    const votes = movie?.vote_count; // popularity confidence

    const normalizedVotes = Math.min(votes / 1000, 1); // cap at 1000 votes

    return ((rating / 10) * 70 + normalizedVotes * 30).toFixed(1);
  };
  
  const contentScore = getContentScore(movie);
  const getScoreComment = (contentScore) => {
  if (contentScore >= 90) return "Perfect must watch";
  if (contentScore >= 80) return "Almost perfect watch";
  if (contentScore >= 70) return "Solid enjoyable watch";
  if (contentScore >= 60) return "Decent enough watch";
  if (contentScore >= 50) return "Slightly weak watch";
  if (contentScore >= 40) return "Barely okay watch";
  return "Not worth watching";
};
const scoreComment = getScoreComment(contentScore);
  console.log("contentScore", contentScore);
  return (
    <div className="w-[23%] p-1 ">
      <MovieWatchBtn movieProvider={movieProvider} />
      <MovieSideBarIcons movie={movie} />
      <MovieSideBarDetails movie={movie} />
      //keywords
      <div className="py-5  border-b-[.05vh] border-gray-300">
        <h2 className="text-[.9vw] font-semibold mt-1">Keywords</h2>
        <div className="flex flex-wrap gap-1 mt-2">
          {movie?.keywords?.length > 0 ? (
            movie.keywords.map((item, i) => {
              return (
                <button
                  key={i}
                  className="  px-3 py-1  mr-1 text-sm bg-[#E0E0E0] rounded"
                >
                  {item?.name}
                </button>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No keywords available</p>
          )}
        </div>
      </div>
      <div className="mt-5 p-1 w-full">
        <h2 className="text-[.9vw] font-semibold mt-1">Content Score</h2>
        <div className="w-full h-[8vh] rounded-lg bg-[#D9D9D9] overflow-hidden">
          <div
            className="h-1/2 w-full pl-3 text-sm font-semibold flex items-center text-white"
            style={{ width: `${contentScore}%`,
          backgroundColor: `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`
          }}
          >
            {contentScore}
          </div>
          <div className="h-1/2 w-full bg-[#D9D9D9] pl-3 text-xs flex items-center ">
            {scoreComment}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailSideBar;
