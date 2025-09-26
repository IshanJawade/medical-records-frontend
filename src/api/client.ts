import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
console.log("[API] baseURL =", BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// attach JWT if you’re storing it (swap to httpOnly cookies if you have them)
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// normalize errors
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Request failed";
    return Promise.reject(new Error(msg));
  }
);
export default api;