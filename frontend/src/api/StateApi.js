import axiosInstance from "./axiosInstance";

const stateApi = {
  getAll: (page = 1, limit = 10, search = "") =>
    axiosInstance.get(
      `/states?page=${page}&limit=${limit}&search=${search}`
    ),

  getById: (id) => axiosInstance.get(`/states/${id}`),

  create: (payload) => axiosInstance.post("/states", payload),

  update: (id, payload) =>
    axiosInstance.put(`/states/${id}`, payload),

  delete: (id) =>
    axiosInstance.delete(`/states/${id}`),

  exportData: (search = "", format = "json") =>
    axiosInstance.get(
      `/states/export?search=${search}&format=${format}`
    ),
};

export default stateApi;