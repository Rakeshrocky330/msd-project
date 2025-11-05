// Configuration file for the application
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/career-tracker"

export const APP_CONFIG = {
  appName: "CareerTracker AI",
  appDescription: "Track your career growth with AI-powered insights",
  defaultRole: "user",
  tokenExpiry: "7d",
}
