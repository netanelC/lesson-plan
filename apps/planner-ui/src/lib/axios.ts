import axios from "axios";

export const api = axios.create({
  // Fallback to our backend port if the env var isn't set yet
  baseURL: import.meta.env.VITE_API_BASE_URL as string | undefined ?? "http://localhost:8080/api",
});
