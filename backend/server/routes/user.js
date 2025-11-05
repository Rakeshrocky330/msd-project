import express from "express"
import { authenticate } from "../middleware/auth.js"
import User from "../models/User.js"

const router = express.Router()

router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
