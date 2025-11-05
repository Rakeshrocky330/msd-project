import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const activityService = {
  getActivities: (userId, limit = 20, skip = 0) =>
    api.get(`/api/activities/${userId}`, { params: { limit, skip } }),
  createActivity: (userId, type, title, description, data) =>
    api.post("/api/activities", { userId, type, title, description, data }),
  markAsRead: (activityId) => api.patch(`/api/activities/${activityId}/read`),
  markAllAsRead: (userId) => api.patch(`/api/activities/${userId}/read-all`),
  deleteActivity: (activityId) => api.delete(`/api/activities/${activityId}`),
  getUnreadCount: (userId) => api.get(`/api/activities/${userId}/unread/count`),
}

export const analyticsService = {
  getAnalytics: (userId) => api.get(`/api/analytics/${userId}`),
  initAnalytics: (userId) => api.post(`/api/analytics/${userId}/init`),
  updateLearningHours: (userId, hours) =>
    api.patch(`/api/analytics/${userId}/learning-hours`, { hours }),
  updateStreak: (userId, currentStreak, longestStreak) =>
    api.patch(`/api/analytics/${userId}/streak`, { currentStreak, longestStreak }),
  incrementStat: (userId, statName, incrementBy = 1) =>
    api.patch(`/api/analytics/${userId}/increment`, { statName, incrementBy }),
  addWeeklyData: (userId, date, hoursLogged, logsCount) =>
    api.post(`/api/analytics/${userId}/weekly`, { date, hoursLogged, logsCount }),
  getLeaderboard: (limit = 100, skip = 0) =>
    api.get("/api/analytics/leaderboard/all", { params: { limit, skip } }),
}

export const notificationService = {
  getNotifications: (userId, limit = 50, skip = 0) =>
    api.get(`/api/notifications/${userId}`, { params: { limit, skip } }),
  createNotification: (userId, type, title, message, actionUrl) =>
    api.post("/api/notifications", { userId, type, title, message, actionUrl }),
  markAsRead: (notificationId) =>
    api.patch(`/api/notifications/${notificationId}/read`),
  markAllAsRead: (userId) => api.patch(`/api/notifications/${userId}/read-all`),
  deleteNotification: (notificationId) =>
    api.delete(`/api/notifications/${notificationId}`),
  clearAll: (userId) => api.delete(`/api/notifications/${userId}/clear-all`),
  getUnreadCount: (userId) => api.get(`/api/notifications/${userId}/unread/count`),
}

export default api
