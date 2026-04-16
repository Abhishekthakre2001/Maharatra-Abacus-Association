import axiosInstance from "./axiosInstance";

const ExamResultApi = {
  start: (payload) => axiosInstance.post("/exam-results/start", payload),

  submit: (id, payload) => axiosInstance.put(`/exam-results/submit/${id}`, payload),

  check: (user_id, exam_id) =>
    axiosInstance.get("/exam-results/check", {
      params: { user_id, exam_id },
    }),

  getById: (id) => axiosInstance.get(`/exam-results/${id}`),

  getByStudentId: (user_id) => axiosInstance.get(`/exam-results/student/${user_id}`),
};

export default ExamResultApi;