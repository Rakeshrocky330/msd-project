import api from "./api"

export const logService = {
  getAll: (filters = {}) => api.get("/logs", { params: filters }),

  getById: (id) => api.get(`/logs/${id}`),

  create: (data) => api.post("/logs", data),

  update: (id, data) => api.put(`/logs/${id}`, data),

  delete: (id) => api.delete(`/logs/${id}`),

  getStats: () => api.get("/logs/stats"),
}
