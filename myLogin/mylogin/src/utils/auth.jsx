import axios from "axios";

const API_URL = "YOUR_API_URL";

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    await axios.post(`${API_URL}/logout`, { refreshToken });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
