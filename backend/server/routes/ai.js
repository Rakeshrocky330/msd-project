import express from "express"
import { authenticate } from "../middleware/auth.js"
import { extractTags, generateSummary, getRecommendations } from "../utils/nlpService.js"
import Log from "../models/Log.js"
import Skill from "../models/Skill.js"

const router = express.Router()

// AI Summarize endpoint
router.post("/summarize", authenticate, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ message: "Text is required" })
    }

    const summary = generateSummary(text)
    const tags = extractTags(text)

    res.json({ summary, tags })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// AI Extract tags endpoint
router.post("/extract-tags", authenticate, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ message: "Text is required" })
    }

    const tags = extractTags(text)
    res.json({ tags })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// AI Recommendation endpoint
router.post("/recommend", authenticate, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.userId })
    const logs = await Log.find({ userId: req.userId })

    const recommendations = getRecommendations(skills, logs)

    res.json({ recommendations })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// AI Weekly Report endpoint
router.get("/weekly-report", authenticate, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const logs = await Log.find({
      userId: req.userId,
      createdAt: { $gte: sevenDaysAgo },
    })

    const skills = await Skill.find({ userId: req.userId })

    const totalHours = logs.reduce((sum, log) => sum + log.duration, 0) / 60
    const topTopics = {}
    logs.forEach((log) => {
      topTopics[log.topic] = (topTopics[log.topic] || 0) + 1
    })

    const sortedTopics = Object.entries(topTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }))

    const topSkills = skills.sort((a, b) => b.selfRating - a.selfRating).slice(0, 5)

    res.json({
      period: "Last 7 days",
      totalLogs: logs.length,
      totalHours: totalHours.toFixed(1),
      topTopics: sortedTopics,
      topSkills: topSkills.map((s) => ({ name: s.name, rating: s.selfRating })),
      averageSessionDuration: logs.length > 0 ? (totalHours / logs.length).toFixed(1) : 0,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// AI Reflection prompt endpoint
router.get("/reflection-prompt", authenticate, async (req, res) => {
  try {
    const prompts = [
      "What was the most challenging concept you learned today?",
      "How can you apply what you learned today to your current project?",
      "What would you like to explore deeper about today's topic?",
      "Did you encounter any obstacles? How did you overcome them?",
      "What surprised you most about today's learning?",
      "How does today's learning connect to your career goals?",
      "What would you teach someone else about what you learned?",
      "What's one thing you'd do differently if you could repeat today's session?",
    ]

    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]

    res.json({ prompt: randomPrompt })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
