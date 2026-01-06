import axiosInstance from './axiosInstance';

const questionApi = {
  getAll: () => axiosInstance.get('/questions'),
  create: (data) => axiosInstance.post('/questions', data),
  bulkSave: (data, onUploadProgress) => axiosInstance.post('/questions/bulk', data, { onUploadProgress }),
  update: (id, data) => axiosInstance.put(`/questions/${id}`, data),
  remove: (id) => axiosInstance.delete(`/questions/${id}`),
};

export default questionApi;
