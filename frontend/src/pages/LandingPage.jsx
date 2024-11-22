import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignInClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center relative">
      {/* Background Sparkles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
      </div>

      {/* Central Content */}
      <div className="relative z-10 bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Welcome to <span className="text-yellow-500">MovieFlix</span>!
        </h1>
        <p className="text-gray-300 mb-8 text-lg">
          Your personal guide to discovering amazing movies and TV shows.
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={handleLoginClick}
            className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
          >
            Log In
          </button>
          <button
            onClick={handleSignInClick}
            className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
          >
            Sign In
          </button>
        </div>
        <div className="mt-8">
          <p className="text-gray-400">
            New here?{" "}
            <span className="font-semibold text-yellow-400">Sign In</span> and
            start exploring today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
