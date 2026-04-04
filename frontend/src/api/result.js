// src/api/userApi.js
import axiosInstance from "./axiosInstance";

const ResultApi = {
  getbyadminid: (id) => axiosInstance.get(`/sets/admin/${id}`),
  create: (payload) => axiosInstance.post("/results", payload),

  // get result
  getresult: (id) => axiosInstance.get(`/results/${id}`),


  // ✅ NEW: check if exam already submitted
  examcheck: (user_id, exam_id) =>
    axiosInstance.get("/results/check", {
      params: {
        user_id,
        exam_id,
      },
    }),

  downloadAllResultsExcel: (id) =>
    axiosInstance.get(`/results/all-results-excel/${id}`, {
      responseType: "blob",
    }),
};

export default ResultApi;