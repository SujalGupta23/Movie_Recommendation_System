import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pass: password }),
        mode: "cors",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        navigate("/dashboard", {
          state: {
            email: data.user.email,
            username: data.user.username,
            genres: data.user.genres,
          },
        });
      } else {
        console.error("Server error:", data);
        setErrorMessage(data.message || "Invalid login credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="relative bg-gray-800 bg-opacity-90 rounded-2xl shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-3xl font-extrabold text-center text-yellow-400 mb-4">
          MovieFlix Login
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Enter your credentials to access your account.
        </p>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4 text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          New here?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-yellow-400 font-medium cursor-pointer hover:text-yellow-300"
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}
