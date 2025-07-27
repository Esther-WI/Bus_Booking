import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

// Enhanced request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  // Debugging logs (remove in production)
  console.log("Current token:", token);
  console.log("Request URL:", config.url);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token attached to request");
  } else {
    console.warn("No token found for protected route");
  }
  
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication error - redirecting to login");
      // You might want to add logout logic here if needed
    }
    return Promise.reject(error);
  }
);

export default api;