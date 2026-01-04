// src/api/userApi.js
import axiosInstance from "./axiosInstance";

const userApi = {
  login: (payload) => axiosInstance.post("/users/login", payload),
  getAll: () => axiosInstance.get("/users"),
  getbyid: (id) => axiosInstance.get(`/users/${id}`),
  create: (payload) => axiosInstance.post("/users", payload),
  update: (id, payload) => axiosInstance.put(`/users${id}`, payload),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
};

export default userApi;