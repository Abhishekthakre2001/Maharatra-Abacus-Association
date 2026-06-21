import axiosInstance from "./axiosInstance";

const ExamResultApi = {
  start: (payload) => axiosInstance.post("/exam-results/start", payload),

  submit: (id, payload) =>
    axiosInstance.put(`/exam-results/submit/${id}`, payload),

  check: (user_id, exam_id) =>
    axiosInstance.get("/exam-results/check", {
      params: { user_id, exam_id },
    }),

  getById: (id) => axiosInstance.get(`/exam-results/${id}`),

  getByStudentId: (user_id) =>
    axiosInstance.get(`/exam-results/student/${user_id}`),

  // getExamResultsByAdmin: (adminId) =>

  //   axiosInstance.get(`/exam-results/examresult/${adminId}`),
  getExamResultsByAdmin: (adminId, page = 1, limit = 5, search = "") =>
    axiosInstance.get(
      `/exam-results/examresult/${adminId}?page=${page}&limit=${limit}&search=${search}`,
    ),
  getExamResultsBylevelnotattempt: (exam_id, level) =>
    axiosInstance.get(`/exam-results/status/${exam_id}?level=${level}`),

  deleteExamResult: (id) => axiosInstance.delete(`/exam-results/${id}`),
  exportexportExamResultsByAdmin: (id) =>
    axiosInstance.get(`/exam-results/export/${id}`, { responseType: "blob" }),
};

export default ExamResultApi;
