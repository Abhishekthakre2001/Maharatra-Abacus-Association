import axiosInstance from "./axiosInstance";

const examRegistartionApi = {
  create: (payload) => axiosInstance.post("/exam-registration/exam-registration", payload),
};

export default examRegistartionApi;
