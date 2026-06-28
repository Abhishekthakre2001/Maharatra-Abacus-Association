import axiosInstance from "./axiosInstance";

const examRegistartionApi = {
  // Get registration page data
  getRegistrationData: (username) =>
    axiosInstance.get(`/individual-registration/registration/${username}`),

  // Create student registration
  create: (data) =>
    axiosInstance.post("/exam-registration/exam-registration", data),
};

export default examRegistartionApi;

// api/RegistrationApi.js

// import axiosInstance from "axios";

// export default {
//     getRegistrationData(username) {
//         return axiosInstance.get(`/individual-registration/registration/${username}`);
//     },
// };