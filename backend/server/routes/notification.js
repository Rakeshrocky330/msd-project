import express from "express"
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
} from "../controllers/notificationController.js"

const router = express.Router()

// Get all notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 50, skip = 0 } = req.query

    const result = await getUserNotifications(userId, parseInt(limit), parseInt(skip))
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get unread notification count
router.get("/:userId/unread/count", async (req, res) => {
  try {
    const { userId } = req.params
    const count = await getUnreadCount(userId)
    res.json({ unreadCount: count })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create notification
router.post("/", async (req, res) => {
  try {
    const { userId, type, title, message, actionUrl } = req.body

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const notification = await createNotification(userId, type, title, message, actionUrl)

    const io = req.app.locals.io
    if (io) {
      io.to(userId).emit("notification:received", notification)
    }

    res.status(201).json(notification)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark notification as read
router.patch("/:notificationId/read", async (req, res) => {
  try {
    const { notificationId } = req.params
    const notification = await markNotificationAsRead(notificationId)
    res.json(notification)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark all notifications as read
router.patch("/:userId/read-all", async (req, res) => {
  try {
    const { userId } = req.params
    const result = await markAllNotificationsAsRead(userId)
    res.json({ modifiedCount: result.modifiedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete notification
router.delete("/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params
    await deleteNotification(notificationId)
    res.json({ message: "Notification deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Clear all notifications
router.delete("/:userId/clear-all", async (req, res) => {
  try {
    const { userId } = req.params
    const result = await clearAllNotifications(userId)
    res.json({ deletedCount: result.deletedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
