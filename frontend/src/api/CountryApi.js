import axiosInstance from "./axiosInstance";

const countryApi = {
    getAll: () => axiosInstance.get("/countries"),
};

export default countryApi;