import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosInstance;
