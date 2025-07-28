import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // Flask backend URL
  withCredentials: false, // Set to true only if using cookies
});

// Request interceptor to attach token and headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("Current token:", token);
  console.log("Request URL:", config.baseURL + config.url);

  config.headers = {
    ...config.headers,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Attach token if exists
  };

  if (token) {
    console.log("✅ Token attached to request");
  } else {
    console.warn("⚠️ No token found for protected route");
  }

  return config;
});

// Response interceptor to catch errors like 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ Authentication error - redirecting to login");
      // Optional: You can trigger logout or redirect to login page here
    }
    return Promise.reject(error);
  }
);

export default api;
