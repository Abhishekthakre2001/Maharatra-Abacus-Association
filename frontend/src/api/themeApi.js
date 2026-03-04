// src/api/userApi.js
import axiosInstance from "./axiosInstance";

const ThemeApi = {
  getThemeColor: (id) => axiosInstance.get(`/theme/${id}`)
};

export default ThemeApi;