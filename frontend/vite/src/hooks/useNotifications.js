import { useState, useEffect, useCallback } from "react"
import { on, off } from "../services/socketService"
import { notificationService } from "../services/realtimeService"

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await notificationService.getNotifications(userId)
        setNotifications(response.data.notifications)
        setUnreadCount(response.data.unreadCount)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching notifications:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    }

    on("notification:received", handleNewNotification)
    return () => off("notification:received", handleNewNotification)
  }, [userId])

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await notificationService.markAsRead(notificationId)
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (err) {
        setError(err.message)
      }
    },
    [],
  )

  const markAllAsRead = useCallback(
    async () => {
      try {
        await notificationService.markAllAsRead(userId)
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
      } catch (err) {
        setError(err.message)
      }
    },
    [userId],
  )

  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        await notificationService.deleteNotification(notificationId)
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId))
        setUnreadCount((prev) => {
          const notification = notifications.find((n) => n._id === notificationId)
          return notification && !notification.read ? prev - 1 : prev
        })
      } catch (err) {
        setError(err.message)
      }
    },
    [notifications],
  )

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
