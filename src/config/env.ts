export const ENV = {
  VITE_APP_API: import.meta.env.VITE_APP_API || "http://localhost:4000/api",
  NODE_ENV: import.meta.env.NODE_ENV || "development",
}; 