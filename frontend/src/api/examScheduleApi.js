import axiosInstance from "./axiosInstance";

const examScheduleApi = {
  getAll: () => axiosInstance.get("/exam-schedule"),
  getByadmin: (id) =>
    axiosInstance.get(`/exam-schedule/all/${id}`),
  create: (payload) => axiosInstance.post("/exam-schedule", payload),
  update: (id, payload) =>
    axiosInstance.put(`/exam-schedule/${id}`, payload),
  delete: (id) =>
    axiosInstance.delete(`/exam-schedule/${id}`),

  // student exam schdule
  getstudnetupcomeingexam : (level, adminid) => axiosInstance.get(`/exam-schedule/studentexam?level=${level}&createdby=${adminid}`),

  // is exam live
  getLiveExam: (level, adminid) =>
  axiosInstance.get(`/exam-schedule/live?level=${level}&createdby=${adminid}`)
};

export default examScheduleApi;
