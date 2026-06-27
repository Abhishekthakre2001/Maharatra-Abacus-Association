import axiosInstance from "./axiosInstance";

const BASE = "/districts";

export default {
    getAll: (page = 1, limit = 10, search = "") =>
        axiosInstance.get(BASE, {
            params: { page, limit, search },
        }),

    getById: (id) => axiosInstance.get(`${BASE}/${id}`),

    create: (data) => axiosInstance.post(BASE, data),

    update: (id, data) => axiosInstance.put(`${BASE}/${id}`, data),

    delete: (id) => axiosInstance.delete(`${BASE}/${id}`),

    export: (search = "", format = "csv") =>
        axiosInstance.get(`${BASE}/export`, {
            params: { search, format },
            responseType: "blob",
        }),

    // THIS IS MISSING
    getByState(stateId) {
        return axiosInstance.get(`/states/state/${stateId}`);
    }
};