import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Preference.css";

export default function Preferences() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Romance",
    "Thriller",
    "Fantasy",
    "Mystery",
    "Crime",
    "Animation",
    "Adventure",
    "Musical",
    "Historical",
    "War",
  ];

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // try {
    //   const response = await fetch("http://127.0.0.1:5000/preferences", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ genres: selectedGenres }),
    //   });
    //   if (response.ok) {
    //     navigate("/dashboard");
    //   } else {
    //     alert("Error saving preferences.");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   alert("Something went wrong.");
    // }
  };

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Select Your Favorite Genres</h1>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl">
            {genres.map((genre) => (
              <label
                key={genre}
                className="genre-box button-17 flex items-center justify-center m-4 text-lg font-semibold pt-2 pb-2"
              >
                <input
                  type="checkbox"
                  value={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                  className="mr-2"
                />
                {genre}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 w-full sm:w-auto rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 transform transition duration-150"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
