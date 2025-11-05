import express from "express"
import { authenticate } from "../middleware/auth.js"
import Log from "../models/Log.js"

const router = express.Router()

// Get all logs for user
router.get("/", authenticate, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(logs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create log
router.post("/", authenticate, async (req, res) => {
  try {
    const log = new Log({
      userId: req.userId,
      ...req.body,
    })
    await log.save()
    res.status(201).json(log)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update log
router.put("/:id", authenticate, async (req, res) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(log)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete log
router.delete("/:id", authenticate, async (req, res) => {
  try {
    await Log.findByIdAndDelete(req.params.id)
    res.json({ message: "Log deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
