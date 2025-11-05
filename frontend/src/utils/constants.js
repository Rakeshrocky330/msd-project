export const API_ENDPOINTS = {
  AUTH: "/auth",
  GOALS: "/goals",
  LOGS: "/logs",
  SKILLS: "/skills",
  PORTFOLIO: "/portfolio",
}

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please try again.",
  UNAUTHORIZED: "Please log in to continue.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input.",
}

export const GOAL_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  PAUSED: "paused",
  ARCHIVED: "archived",
}

export const SKILL_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  EXPERT: "expert",
}
