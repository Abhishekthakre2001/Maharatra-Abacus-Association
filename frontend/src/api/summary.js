// src/api/userApi.js
import axiosInstance from "./axiosInstance";

const setsApi = {
  getsummary: (id) => axiosInstance.get(`/summary/${id}`)
};

export default setsApi;