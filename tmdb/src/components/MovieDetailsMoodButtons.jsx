import React from 'react'
import { fetchMovies } from '../api/movies';

function MovieDetailsMoodButtons({ movie }) {
    const moodButtons = [
  { label: "Adventurous", key: "adventurous", genres: "12" },
  { label: "Fantastical", key: "fantastical", genres: "14" },
  { label: "Animated", key: "animated", genres: "16" },
  { label: "Dramatic", key: "dramatic", genres: "18" },
  { label: "Terrifying", key: "terrifying", genres: "27" },
  { label: "Action Packed", key: "action-packed", genres: "28" },
  { label: "Funny", key: "funny", genres: "35" },
  { label: "Historical", key: "historical", genres: "36" },
  { label: "Suspenseful", key: "suspenseful", genres: "53" },
  { label: "Gritty", key: "gritty", genres: "80" },
  { label: "Thought Provoking", key: "thought-provoking", genres: "99" },
  { label: "Out of this World", key: "out-of-this-world", genres: "878" },
  { label: "Mysterious", key: "mysterious", genres: "9648" },
  { label: "Musical", key: "musical", genres: "10402" },
  { label: "Romantic", key: "romantic", genres: "10749" },
  { label: "Family Friendly", key: "family-friendly", genres: "10751" },
  { label: "Heroic", key: "heroic", genres: "28" },
  { label: "Made for TV", key: "made-for-tv", genres: "10770" }
];
// const handleClick = async (btn) => {

//     console.log("CLICKED:", btn.label);
//   try {
//     const data = await fetchMovies(btn.genres);

//     console.log("mood:", btn.label);
//     console.log("mood movies:", data.results); // 👈 important
//   } catch (error) {
//     console.error("Error fetching mood movies", error);
//   }
// };
const handleClick = async (btn) => {
  console.log("STEP 1");

  try {
    console.log("STEP 2 - BEFORE API");

    const data = await fetchMovies(btn.genres);

    if (!data) {
      console.log("API RETURNED NULL");
      return;
    }

    console.log("STEP 3 - AFTER API", data.results);

  } catch (error) {
    console.log("STEP ERROR:", error);
  }
};
console.log("Mood buttons:", movie); // Debugging log
  return (
    <div className='py-3 w-full'>
        <h4 className="text-[1vw] font-semibold mb-4">
        Or maybe something a bit more...
      </h4>
      <div className="flex flex-wrap gap-2">
        {moodButtons.map((btn,i)=>{
            return(
                <div onClick={()=>{
                      console.log(" WORKING");
                      console.log("DIRECT CLICK");
    alert("DIRECT CLICK");
 // Simple alert for feedback

                }}
                 key={btn.key} className="py-1 px-4 bg-[#01B4E6] cursor-pointer text-sm font-semibold text-white rounded-full hover:bg-[#032541] transition-all">
                    {btn.label}
                </div>
            )
        })}
      </div>
        

    </div>
  )
}

export default MovieDetailsMoodButtons