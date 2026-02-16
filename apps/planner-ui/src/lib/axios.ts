import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor to automatically attach the token to every request
// That way, when a use refreshes the page, we don't lose the token and have to log in again.
api.interceptors.request.use(
  (config) => {
    // 1. Grab the token from wherever you store it (localStorage is most common)
    const token = localStorage.getItem("token");

    // 2. If the token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
