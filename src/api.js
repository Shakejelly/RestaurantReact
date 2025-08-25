import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://localhost:7053";

export const api = axios.create({
  baseURL: API_BASE + "/api",
  withCredentials: false,
});
