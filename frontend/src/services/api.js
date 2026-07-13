import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Dashboard APIs
export const getDrivers = () => api.get("/drivers");

export const getConstructors = () => api.get("/constructors");

export const getRaces = () => api.get("/races");

// Prediction API
export const predictWinner = (data) => api.post("/predict", data);

export default api;