import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import Login from "./pages/Register/Login";
import Registration from "./pages/Register/Registration";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Preferences from "./components/Preferences";
import Founders from "./pages/Founders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/preference" element={<Preferences />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/founders" element={<Founders />} />
      </Routes>
    </Router>
  );
}

export default App;
