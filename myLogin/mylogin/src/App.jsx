import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import { refreshToken, logout } from "./utils/auth";

const INACTIVITY_TIMEOUT = 25 * 60 * 1000; // 25 minutes

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsAuthenticated(true);
        startActivityMonitoring();
      }
    };
    checkAuth();
  }, []);

  const startActivityMonitoring = () => {
    const resetTimer = () => setLastActivity(Date.now());
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    const interval = setInterval(async () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > INACTIVITY_TIMEOUT) {
        await handleLogout();
      } else {
        const newToken = await refreshToken();
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
        } else {
          await handleLogout();
        }
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      clearInterval(interval);
    };
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Home handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
