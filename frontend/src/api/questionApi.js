// import axiosInstance from "./axiosInstance";

// const questionApi = {
//   getAll: () => axiosInstance.get("/questions"),
//   // getbyadmin: (id) => axiosInstance.get(`/questions/admin/${id}`),
//   getbyadmin: (adminId, page = 1, limit = 5, search = "") =>
//     axiosInstance.get(
//       `/questions/admin/${adminId}?page=${page}&limit=${limit}&search=${search}`,
//     ),
//   exportData: (id) =>
//     axiosInstance.get(`/questions/export/${id}`, { responseType: "blob" }),
//   create: (data) => axiosInstance.post("/questions", data),
//   bulkSave: (data, onUploadProgress) =>
//     axiosInstance.post("/questions/bulk", data, { onUploadProgress }),
//   update: (id, data) => axiosInstance.put(`/questions/${id}`, data),
//   updateSet: (data) => axiosInstance.put(`/questions/updateset`, data),
//   remove: (id) => axiosInstance.delete(`/questions/${id}`),
//   removeSet: (level, set_id) =>
//     axiosInstance.delete(`/questions/deleteset/level/${level}/set/${set_id}`),

//   getset: (level, set_id) =>
//     axiosInstance.get(
//       `/questions/level-wise-sets?level=${level}&createdby=${set_id}`,
//     ),

//   getpapersetformock: (level, createdby, set) =>
//     axiosInstance.get(
//       `/questions/paperset?level=${level}&set=${set}&createdby=${createdby}`,
//     ),
// };

// export default questionApi;


import axiosInstance from "./axiosInstance";

// Create Question Paper
const create = (payload) => {
  return axiosInstance.post("/questions/import", payload);
};

// Get Question Papers
const getAll = (page = 1, limit = 10, search = "") => {
  return axiosInstance.get("/questions", {
    params: {
      page,
      limit,
      search,
    },
  });
};

// Update Question Paper
const update = (id, payload) => {
  return axiosInstance.put(`/questions/${id}`, payload);
};

// Delete Question Paper
const remove = (id) => {
  return axiosInstance.delete(`/questions/${id}`);
};

export default {
  create,
  getAll,
  update,
  remove,
};