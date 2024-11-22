import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownMovies, setDropdownMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const searchBoxRef = useRef(null);

  const { username, genres } = location.state || {};

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/movies?username=${username}`
        );
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setMovies(data.movies);
          setFilteredMovies(data.movies); // Set initial filtered movies
        } else {
          console.error("Error fetching movies:", data.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    if (username) {
      fetchMovies();
    }
  }, [username]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/search-movies?query=${query}`
      );
      const data = await response.json();

      if (response.ok) {
        setDropdownMovies(data.titles);
      } else {
        console.error("Error fetching search results:", data.message);
      }
    } catch (error) {
      console.error("Error during search fetch:", error);
    }
  };

  const fetchRecommendations = async (query) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: query }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setFilteredMovies(
          data.recommendations.map((movie) => ({
            poster_path: movie.poster_path,
            title: movie.title,
          }))
        );
        setIsSearching(true);
      } else {
        console.error("Error fetching recommendations:", data.message);
      }
    } catch (error) {
      console.error("Error during recommendation fetch:", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.trim() === "") {
      setFilteredMovies(movies);
      setIsSearching(false);
      setDropdownMovies([]);
    } else {
      fetchSearchResults(query);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      fetchRecommendations(searchTerm);
      setDropdownMovies([]);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-purple-800 to-black py-2">
      <div className="w-full max-w-5xl rounded-t-lg bg-indigo-600 py-2">
        <h1
          onClick={() => navigate("/founders")}
          className="text-white text-xl font-bold text-center animate-marquee cursor-pointer"
        >
          Meet Our Founder's Team
        </h1>
      </div>
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-2xl min-h-[750px]">
        <h1 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">
          Welcome, {username}!
        </h1>
        {!isSearching && (
          <p className="text-lg text-center text-gray-600 mb-6">
            Based on your preferences: {genres?.join(", ")}
          </p>
        )}

        <form
          className="flex flex-col items-center space-y-6 mb-8"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full max-w-md">
            <div className="relative flex-grow" ref={searchBoxRef}>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownVisible(true)}
                className="w-full px-5 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              />
              {isDropdownVisible && dropdownMovies.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 w-full mt-2 max-h-40 overflow-y-auto rounded-lg shadow-lg z-10">
                  {dropdownMovies.map((movie, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSearchTerm(movie);
                        setIsDropdownVisible(false);
                      }}
                      className="px-5 py-3 cursor-pointer hover:bg-indigo-100 transition-colors"
                    >
                      {movie}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
            >
              Get Recommendations
            </button>
          </div>
        </form>

        <div className="flex-1 overflow-y-auto h-[500px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
                >
                  {movie.poster_path ? (
                    <img
                      src={movie.poster_path}
                      alt={movie.title || "Movie Poster"}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-300 rounded-md mb-4 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <h3 className="text-xl text-center font-semibold text-indigo-800 mb-3">
                    {movie.title || "Untitled"}
                  </h3>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No movies found. Try adjusting your search.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
