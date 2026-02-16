// src/api/userApi.js
import axiosInstance from "./axiosInstance";

const userApi = {
  login: (payload) => axiosInstance.post("/users/login", payload),
  getAll: () => axiosInstance.get("/users"),
  getbyid: (id) => axiosInstance.get(`/users/${id}`),
  getbyadminid: (id) => axiosInstance.get(`/users/admin/${id}`),
  create: (payload) => axiosInstance.post("/users", payload),
  update: (id, payload) => axiosInstance.put(`/users/${id}`, payload),
  delete: (id) => axiosInstance.delete(`/users/${id}`),


  // Registred students for exam
  getregistredstudentbyadminid: (id) => axiosInstance.get(`/exam-registration/createdby/${id}`),
};

export default userApi;