import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import { refreshToken, logout } from "./utils/auth";

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes
const TOKEN_REFRESH_INTERVAL = 1 * 60 * 1000; // 1 minutes

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const startActivityMonitoring = useCallback(() => {
    const resetTimer = () => setLastActivity(Date.now());
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    const interval = setInterval(async () => {
      const currentTime = Date.now();
      console.log(
        "Checking inactivity, last activity:",
        currentTime - lastActivity
      );
      if (currentTime - lastActivity > INACTIVITY_TIMEOUT) {
        console.log("User has been inactive for too long, logging out");
        await handleLogout();
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      clearInterval(interval);
    };
  }, [lastActivity]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    let cleanup;
    if (isAuthenticated) {
      cleanup = startActivityMonitoring();
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [isAuthenticated, startActivityMonitoring]);

  // New useEffect for periodic token refresh
  useEffect(() => {
    let intervalId;
    if (isAuthenticated) {
      const refreshAccessToken = async () => {
        const newToken = await refreshToken();
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
        } else {
          await handleLogout();
        }
      };

      refreshAccessToken(); // Refresh token immediately when effect runs
      intervalId = setInterval(refreshAccessToken, TOKEN_REFRESH_INTERVAL);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated]); //}, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    // setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
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
