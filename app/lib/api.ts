// Axios client for backend — all business data via TanStack Query (never fetch outside Query)
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export type ApiError = { error: { code: string; message: string } };
