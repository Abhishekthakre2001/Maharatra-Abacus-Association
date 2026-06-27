import axiosInstance from "./axiosInstance";

const InstituteApi = {
  getAll: (page = 1, limit = 10, search = "") =>
    axiosInstance.get(
      `/institute?page=${page}&limit=${limit}&search=${search}`
    ),

  getById: (id) => axiosInstance.get(`/institute/${id}`),

  create: (payload) => axiosInstance.post("/institute", payload),

  update: (id, payload) => axiosInstance.put(`/institute/${id}`, payload),

  delete: (id) => axiosInstance.delete(`/institute/${id}`),

  exportData: (search = "", format = "json") =>
    axiosInstance.get(
      `/institute/export?search=${search}&format=${format}`
    ),
};

export default InstituteApi;