import axiosInstance from './axiosInstance';

const questionApi = {
  getAll: () => axiosInstance.get('/questions'),
  getbyadmin: (id) => axiosInstance.get(`/questions/admin/${id}`),
  create: (data) => axiosInstance.post('/questions', data),
  bulkSave: (data, onUploadProgress) => axiosInstance.post('/questions/bulk', data, { onUploadProgress }),
  update: (id, data) => axiosInstance.put(`/questions/${id}`, data),
  updateSet: (data) => axiosInstance.put(`/questions/updateset`, data),
  remove: (id) => axiosInstance.delete(`/questions/${id}`),
  removeSet: (level, set_id) => axiosInstance.delete(`/questions/deleteset/level/${level}/set/${set_id}`),
};

export default questionApi;
