import axios from "axios";

const API_URL = "http://localhost:80/auth/rest";

export const login = async (credentials) => {
  // console.log(credentials);
  try {
    const response = await axios.post(`${API_URL}/token`, credentials, {
      headers: { "Content-Type": "application/json" },
    });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return true;
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const response = await axios.post(
      `http://localhost:80/auth/rest/token/refresh`,
      { refreshToken: refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Token refreshed:", response.data.accessToken);
    console.log("Refreshed date:", Date.now());
    return response.data.accessToken;
  } catch (error) {
    console.error(
      "Token refresh failed:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
