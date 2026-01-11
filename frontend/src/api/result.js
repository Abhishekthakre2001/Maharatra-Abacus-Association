// src/api/userApi.js
import axiosInstance from "./axiosInstance";

const ResultApi = {
  getbyadminid: (id) => axiosInstance.get(`/sets/admin/${id}`),
  create: (payload) => axiosInstance.post("/results", payload)
};

export default ResultApi;