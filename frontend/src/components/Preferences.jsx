import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Preferences() {
  const location = useLocation();
  const username = location.state?.username; // Retrieve username from state
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
    e.preventDefault();

    if (selectedGenres.length === 0) {
      alert("Please select at least one genre.");
      return;
    }

    if (!username) {
      alert("Username is required!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, genres: selectedGenres }),
      });

      if (response.ok) {
        alert("Preferences saved successfully!");
        navigate("/dashboard", { state: { username, genres: selectedGenres } });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error saving preferences.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else if (prev.length < 3) {
        return [...prev, genre];
      } else {
        alert("You can select up to 3 genres only!");
        return prev;
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-10 space-y-8">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          Select Your Favorite Genres
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {genres.map((genre) => (
              <label
                key={genre}
                className={`genre-box flex items-center justify-center px-4 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                  selectedGenres.includes(genre)
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-white text-gray-900 border border-gray-300"
                } hover:shadow-lg hover:bg-indigo-500 hover:text-white`}
              >
                <input
                  type="checkbox"
                  value={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                  className="hidden"
                />
                {genre}
              </label>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="w-full max-w-md py-3 px-6 text-lg font-semibold text-white bg-indigo-600 rounded-xl shadow-lg transform transition duration-150 ease-in-out hover:bg-indigo-500 hover:scale-105 focus:ring-4 focus:ring-indigo-300 active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
