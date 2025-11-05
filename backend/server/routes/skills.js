import express from "express"
import { authenticate } from "../middleware/auth.js"
import Skill from "../models/Skill.js"

const router = express.Router()

router.get("/", authenticate, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.userId })
    res.json(skills)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", authenticate, async (req, res) => {
  try {
    const skill = new Skill({ userId: req.userId, ...req.body })
    await skill.save()
    res.status(201).json(skill)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/:id", authenticate, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(skill)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
