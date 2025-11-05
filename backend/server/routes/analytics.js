import express from "express"
import {
  getOrCreateAnalytics,
  getUserAnalytics,
  updateLearningHours,
  updateStreakData,
  addWeeklyData,
  incrementStats,
  getAllAnalytics,
} from "../controllers/analyticsController.js"

const router = express.Router()

// Get analytics for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const analytics = await getUserAnalytics(userId)
    res.json(analytics)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// Get or create analytics
router.post("/:userId/init", async (req, res) => {
  try {
    const { userId } = req.params
    const analytics = await getOrCreateAnalytics(userId)
    res.json(analytics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update learning hours
router.patch("/:userId/learning-hours", async (req, res) => {
  try {
    const { userId } = req.params
    const { hours } = req.body

    if (!hours || isNaN(hours)) {
      return res.status(400).json({ error: "Valid hours value required" })
    }

    const analytics = await updateLearningHours(userId, parseFloat(hours))
    const io = req.app.locals.io
    if (io) {
      io.emit("analytics:updated", { userId, totalLearningHours: analytics.totalLearningHours })
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update streak
router.patch("/:userId/streak", async (req, res) => {
  try {
    const { userId } = req.params
    const { currentStreak, longestStreak } = req.body

    if (!currentStreak || !longestStreak) {
      return res.status(400).json({ error: "Streak values required" })
    }

    const analytics = await updateStreakData(userId, parseInt(currentStreak), parseInt(longestStreak))

    const io = req.app.locals.io
    if (io) {
      io.emit("analytics:updated", {
        userId,
        currentStreak: analytics.currentStreak,
        longestStreak: analytics.longestStreak,
      })
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Increment a stat (logsCreated, goalsCompleted, skillsAdded)
router.patch("/:userId/increment", async (req, res) => {
  try {
    const { userId } = req.params
    const { statName, incrementBy = 1 } = req.body

    if (!statName) {
      return res.status(400).json({ error: "Stat name required" })
    }

    const analytics = await incrementStats(userId, statName, parseInt(incrementBy))

    const io = req.app.locals.io
    if (io) {
      io.emit("analytics:updated", { userId, [statName]: analytics[statName] })
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add weekly data
router.post("/:userId/weekly", async (req, res) => {
  try {
    const { userId } = req.params
    const { date, hoursLogged, logsCount } = req.body

    const analytics = await addWeeklyData(userId, new Date(date), parseFloat(hoursLogged), parseInt(logsCount))

    const io = req.app.locals.io
    if (io) {
      io.emit("analytics:updated", { userId, weeklyDataAdded: true })
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all leaderboard data
router.get("/leaderboard/all", async (req, res) => {
  try {
    const { limit = 100, skip = 0 } = req.query
    const result = await getAllAnalytics(parseInt(limit), parseInt(skip))
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
