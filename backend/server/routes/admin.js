import express from "express"
import { authenticate, authorize } from "../middleware/auth.js"
import User from "../models/User.js"
import Log from "../models/Log.js"

const router = express.Router()

router.get("/users", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/stats", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalLogs = await Log.countDocuments()
    res.json({ totalUsers, totalLogs })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
