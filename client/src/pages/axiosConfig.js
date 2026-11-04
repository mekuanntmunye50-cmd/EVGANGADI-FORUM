import axios from "axios";

// Set REACT_APP_API_URL in client/.env for production deployments
const axiosBase = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5500/api",
});

export default axiosBase;
