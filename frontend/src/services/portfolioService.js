import api from "./api"

export const portfolioService = {
  getAll: () => api.get("/portfolio"),

  getById: (id) => api.get(`/portfolio/${id}`),

  create: (data) => api.post("/portfolio", data),

  update: (id, data) => api.put(`/portfolio/${id}`, data),

  delete: (id) => api.delete(`/portfolio/${id}`),

  getPublic: (username) => api.get(`/portfolio/public/${username}`),
}
