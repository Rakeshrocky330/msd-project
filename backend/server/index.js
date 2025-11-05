import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import authRoutes from "./routes/auth.js"
import logRoutes from "./routes/logs.js"
import goalRoutes from "./routes/goals.js"
import skillRoutes from "./routes/skills.js"
import aiRoutes from "./routes/ai.js"
import userRoutes from "./routes/user.js"
import adminRoutes from "./routes/admin.js"
import activityRoutes from "./routes/activity.js"
import analyticsRoutes from "./routes/analytics.js"

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Store active connections
const activeUsers = new Map()

// WebSocket event handlers
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on("user:login", (userId) => {
    activeUsers.set(userId, socket.id)
    console.log(`User ${userId} logged in. Active users: ${activeUsers.size}`)
    io.emit("users:status", { activeCount: activeUsers.size, timestamp: new Date() })
  })

  socket.on("disconnect", () => {
    let userId
    for (const [uId, sId] of activeUsers.entries()) {
      if (sId === socket.id) {
        userId = uId
        activeUsers.delete(uId)
        break
      }
    }
    console.log(`User ${userId} disconnected. Active users: ${activeUsers.size}`)
    io.emit("users:status", { activeCount: activeUsers.size, timestamp: new Date() })
  })

  socket.on("activity:create", (data) => {
    io.emit("activity:new", { ...data, timestamp: new Date() })
  })

  socket.on("data:request", (eventName) => {
    socket.emit(`data:${eventName}`, { status: "ready" })
  })
})

// Store io instance globally for use in routes
app.locals.io = io

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ai-career-tracker")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/logs", logRoutes)
app.use("/api/goals", goalRoutes)
app.use("/api/skills", skillRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/activities", activityRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", activeUsers: activeUsers.size })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`WebSocket server ready on ws://localhost:${PORT}`)
})
