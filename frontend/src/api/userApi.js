// src/api/userApi.js
import axiosInstance from "./axiosInstance";

const userApi = {
  login: (payload) => axiosInstance.post("/users/login", payload),
  getAll: () => axiosInstance.get("/users"),
  getbyid: (id) => axiosInstance.get(`/users/${id}`),
  getbyadminid: (
    id,
    page = 1,
    limit = 5,
    search = "",
    individual_registration,
  ) =>
    axiosInstance.get(
      `/users/admin/${id}?page=${page}&limit=${limit}&search=${search}${
        individual_registration !== undefined
          ? `&individual_registration=${individual_registration}`
          : ""
      }`,
    ),
  create: (payload) => axiosInstance.post("/users", payload),
  update: (id, payload) => axiosInstance.put(`/users/${id}`, payload),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
  exportData: (id) =>
    axiosInstance.get(`/users/export/${id}`, { responseType: "blob" }),

  exportTestResultData: (id) =>
    axiosInstance.get(`/users/test-result/export/${id}`, {
      responseType: "blob",
    }),
  exportExamRegistrationData: (createdby) =>
    axiosInstance.get(`/exam-registration/export/${createdby}`, {
      responseType: "blob",
    }),
  // getresultbyadminid: (id) => axiosInstance.get(`/results/admin/${id}`),
  getresultbyadminid: (id, page = 1, limit = 5, search = "") =>
    axiosInstance.get(
      `/results/admin/${id}?page=${page}&limit=${limit}&search=${search}`,
    ),

  // Registred students for exam
  // getregistredstudentbyadminid: (id) =>
  //   axiosInstance.get(`/exam-registration/createdby/${id}`),
  getregistredstudentbyadminid: (id, page = 1, limit = 5, search = "") =>
    axiosInstance.get(
      `/exam-registration/createdby/${id}?page=${page}&limit=${limit}&search=${search}`,
    ),
};

export default userApi;
