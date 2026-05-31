import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getPopularPeople } from "../api/movies";
import PeoplePaginationBar from "../components/PeoplePaginationBar";
import HomeFooter from "../components/HomeFooter";
import { useNavigate } from "react-router-dom";

function Person() {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPeople(page);
  }, [page]);

  const fetchPeople = async (currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPopularPeople(currentPage);

      if (!data || !data.results) {
        throw new Error("No data found");
      }

      setPeople(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError("PersonError");
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  // ERROR UI
  if (error) {
    return (
      <div className="h-screen w-full ">
        <Navbar/>
        <div className="h-[57.3vh] w-[63%] mx-auto ">
          <p className="font-semibold text-2xl py-5">Uh-oh! That's not a valid request!</p>
          <p className="text-sm">This request could not be completed. If you believe this to be an error, let me know <span className="text-blue-500"> on the linkedin.</span></p>
          <h1 className="text-3xl font-semibold py-3">OR</h1>
          <button onClick={() => {
  if (window.history.state && window.history.length > 1) {
    navigate(-1);
  } else {
    navigate("/person"); // fallback route
  }
}} className="bg-[#01B4E4] cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-[#019bc4]">
            Go Back
          </button>
        </div>
        <HomeFooter/>
      </div>
    );
  }

  // LOADING UI
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container w-[70%] mx-auto py-5">
        <h2 className="text-2xl font-bold mb-4">Popular People</h2>

        {/* GRID */}
        <div className="grid grid-cols-4 gap-4">
          {people.map((person) => (
            <div key={person.id}>
              <img
                className="w-full h-[45vh] object-cover object-[center_5%] rounded-lg"
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                    : "/placeholder.jpg"
                }
                alt={person.name}
              />

              <div className="py-1 px-2 pb-3">
                <h3 className="text-[1vw] leading-[1vw] font-semibold">
                  {person.name}
                </h3>

                <p className="text-[0.8vw] leading-[1.1vw] text-gray-500">
                  {person.known_for?.length > 0
                    ? person.known_for
                        .map((item) => item.title || item.name)
                        .filter(Boolean)
                        .join(", ")
                        .replace(/, ([^,]*)$/, " and $1")
                    : "No known works"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <PeoplePaginationBar
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
        <HomeFooter/>

    </div>
  );
}

export default Person;