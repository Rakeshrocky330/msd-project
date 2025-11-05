import express from "express"
import { authenticate } from "../middleware/auth.js"
import Goal from "../models/Goal.js"

const router = express.Router()

router.get("/", authenticate, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId })
    res.json(goals)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", authenticate, async (req, res) => {
  try {
    const goal = new Goal({ userId: req.userId, ...req.body })
    await goal.save()
    res.status(201).json(goal)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/:id", authenticate, async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(goal)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/:id", authenticate, async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id)
    res.json({ message: "Goal deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
