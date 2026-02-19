import axios from "axios";

const TOKEN_STORAGE_KEY = "ems_token";
const SESSION_TOKEN_STORAGE_KEY = "ems_session_token";

const readToken = () =>
  localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY) || "";

export const setAuthToken = (token, remember = true) => {
  if (!token) return;
  if (remember) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    sessionStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
  } else {
    sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
};

const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
const baseURL = normalizedApiBaseUrl
  ? normalizedApiBaseUrl.endsWith("/api")
    ? normalizedApiBaseUrl
    : `${normalizedApiBaseUrl}/api`
  : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
