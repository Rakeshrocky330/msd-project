import express from "express"
import { authenticate } from "../middleware/auth.js"
import Portfolio from "../models/Portfolio.js"
import User from "../models/User.js"
import Skill from "../models/Skill.js"
import Log from "../models/Log.js"
import crypto from "crypto"

const router = express.Router()

// Get user portfolio
router.get("/", authenticate, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.userId })
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.userId })
      await portfolio.save()
    }
    res.json(portfolio)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update portfolio
router.put("/", authenticate, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate({ userId: req.userId }, req.body, { new: true })
    res.json(portfolio)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Generate share token
router.post("/generate-share", authenticate, async (req, res) => {
  try {
    const shareToken = crypto.randomBytes(16).toString("hex")
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.userId },
      { shareToken, isPublic: true },
      { new: true },
    )
    res.json({ shareToken, shareUrl: `${process.env.CLIENT_URL}/portfolio/${shareToken}` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get public portfolio
router.get("/public/:shareToken", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ shareToken: req.params.shareToken })
    if (!portfolio || !portfolio.isPublic) {
      return res.status(404).json({ message: "Portfolio not found" })
    }

    const user = await User.findById(portfolio.userId).select("-password")
    const skills = await Skill.find({ userId: portfolio.userId })
    const logs = await Log.find({ userId: portfolio.userId })

    res.json({
      portfolio,
      user,
      skills,
      totalLearningHours: logs.reduce((sum, log) => sum + log.duration, 0) / 60,
      totalLogs: logs.length,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Generate resume data
router.get("/resume-data", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const portfolio = await Portfolio.findOne({ userId: req.userId })
    const skills = await Skill.find({ userId: req.userId })
    const logs = await Log.find({ userId: req.userId })

    const resumeData = {
      name: user.name,
      email: user.email,
      bio: portfolio?.bio || "",
      totalLearningHours: (logs.reduce((sum, log) => sum + log.duration, 0) / 60).toFixed(1),
      skills: skills.map((s) => ({ name: s.name, rating: s.selfRating, category: s.category })),
      topTopics: {},
      certifications: portfolio?.certifications || [],
    }

    logs.forEach((log) => {
      resumeData.topTopics[log.topic] = (resumeData.topTopics[log.topic] || 0) + 1
    })

    res.json(resumeData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
