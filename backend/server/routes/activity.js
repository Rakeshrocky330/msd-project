import express from "express"
import {
  createActivity,
  getUserActivities,
  markActivityAsRead,
  markAllActivitiesAsRead,
  deleteActivity,
  getUnreadActivityCount,
} from "../controllers/activityController.js"

const router = express.Router()

// Get all activities for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20, skip = 0 } = req.query

    const result = await getUserActivities(userId, parseInt(limit), parseInt(skip))
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get unread activity count
router.get("/:userId/unread/count", async (req, res) => {
  try {
    const { userId } = req.params
    const count = await getUnreadActivityCount(userId)
    res.json({ unreadCount: count })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create activity
router.post("/", async (req, res) => {
  try {
    const { userId, type, title, description, data } = req.body

    if (!userId || !type || !title) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const activity = await createActivity(userId, type, title, description, data)
    const io = req.app.locals.io
    if (io) {
      io.to(userId).emit("activity:created", activity)
    }

    res.status(201).json(activity)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark activity as read
router.patch("/:activityId/read", async (req, res) => {
  try {
    const { activityId } = req.params
    const activity = await markActivityAsRead(activityId)
    res.json(activity)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark all activities as read
router.patch("/:userId/read-all", async (req, res) => {
  try {
    const { userId } = req.params
    const result = await markAllActivitiesAsRead(userId)
    res.json({ modifiedCount: result.modifiedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete activity
router.delete("/:activityId", async (req, res) => {
  try {
    const { activityId } = req.params
    await deleteActivity(activityId)
    res.json({ message: "Activity deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
