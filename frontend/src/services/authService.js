import api from "./api"

export const authService = {
  register: (email, password) => api.post("/auth/register", { email, password }),

  login: (email, password) => api.post("/auth/login", { email, password }),

  getProfile: () => api.get("/auth/profile"),

  updateProfile: (data) => api.put("/auth/profile", data),

  verifyEmail: (token) => api.post("/auth/verify-email", { token }),

  requestPasswordReset: (email) => api.post("/auth/forgot-password", { email }),

  resetPassword: (token, newPassword) => api.post("/auth/reset-password", { token, newPassword }),

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },
}
