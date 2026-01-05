import axiosInstance from "./axiosInstance";

const levelApi = {
  getAll: () => axiosInstance.get("/levels"),
  getbyadminid: (adminid) => axiosInstance.get(`/levels/admin?adminid=${adminid}`),
  create: (payload) => axiosInstance.post("/levels", payload),
  update: (id, payload) => axiosInstance.put(`/levels/${id}`, payload),
  delete: (id) => axiosInstance.delete(`/levels/${id}`),
};

export default levelApi;
