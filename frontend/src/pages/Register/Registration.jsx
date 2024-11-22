import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userName, email, pass: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          "Registration successful! Redirecting to Preferences..."
        );
        setErrorMessage("");
        setTimeout(() => {
          navigate("/preference", { state: { username: userName } });
        }, 2000);
      } else {
        setErrorMessage(
          data.message || "Registration failed. Please try again."
        );
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("Something went wrong. Please try again later.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-center text-yellow-400 mb-4">
          Join MovieFlix
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Create your account and dive into the world of movies.
        </p>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4 text-center font-medium">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-green-500 text-sm mb-4 text-center font-medium">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-200"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="block w-full rounded-md bg-gray-700 border border-gray-600 py-2 px-3 text-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-500"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200"
            >
              Email Address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-gray-700 border border-gray-600 py-2 px-3 text-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-gray-700 border border-gray-600 py-2 px-3 text-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-gradient-to-r from-yellow-500 to-red-500 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-yellow-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transform hover:scale-105 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 font-medium cursor-pointer hover:text-yellow-300"
          >
            Log in here
          </span>
        </p>
      </div>
    </div>
  );
}
