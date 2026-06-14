// import axios from "axios";

// const axiosInstance = axios.create({
//   // baseURL: "https://apiabacus.deveraa.com",
//   baseURL: "http://localhost:4001",
//   // baseURL: "https://test.abacusapi.deveraa.com",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

// axiosInstance.interceptors.response.use(
//   response => response,
//   error => {
//     console.error("API Error:", error.response?.data);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://apiabacus.deveraa.com",
  baseURL: "http://localhost:4001",
  // baseURL: "https://test.abacusapi.deveraa.com",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

const fullUrl={
   // baseURL: "https://apiabacus.deveraa.com",
  baseURL: "http://localhost:4001",
  // baseURL: "https://test.abacusapi.deveraa.com",
}
// ==========================
// REQUEST INTERCEPTOR
// ==========================
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// RESPONSE INTERCEPTOR
// ==========================
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    console.error("API Error:", error.response?.data);

    // prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // access token expired
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Access token expired"
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken") ||
          sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        const refreshResponse = await axios.post(
         fullUrl.baseURL + "/users/refresh-token",
          {
            refreshToken,
          }
        );

        const newAccessToken =
          refreshResponse.data.accessToken;

        // Save new access token
        if (localStorage.getItem("token")) {
          localStorage.setItem(
            "token",
            newAccessToken
          );
        } else {
          sessionStorage.setItem(
            "token",
            newAccessToken
          );
        }

        // Update failed request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // Retry original request
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error(
          "Refresh Token Expired:",
          refreshError
        );

        // logout
        localStorage.clear();
        sessionStorage.clear();

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;