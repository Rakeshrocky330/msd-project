import { useState, useEffect, useCallback } from "react"
import { on, off } from "../services/socketService"
import { activityService } from "../services/realtimeService"

export const useActivities = (userId) => {
  const [activities, setActivities] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await activityService.getActivities(userId, 20, 0)
        setActivities(response.data.activities)
        setHasMore(response.data.hasMore)

        const unreadResponse = await activityService.getUnreadCount(userId)
        setUnreadCount(unreadResponse.data.unreadCount)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching activities:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()

    const handleNewActivity = (activity) => {
      setActivities((prev) => [activity, ...prev])
      if (!activity.read) {
        setUnreadCount((prev) => prev + 1)
      }
    }

    on("activity:created", handleNewActivity)
    return () => off("activity:created", handleNewActivity)
  }, [userId])

  const markAsRead = useCallback(
    async (activityId) => {
      try {
        await activityService.markAsRead(activityId)
        setActivities((prev) =>
          prev.map((a) => (a._id === activityId ? { ...a, read: true } : a)),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (err) {
        setError(err.message)
      }
    },
    [],
  )

  const deleteActivity = useCallback(
    async (activityId) => {
      try {
        await activityService.deleteActivity(activityId)
        setActivities((prev) => prev.filter((a) => a._id !== activityId))
      } catch (err) {
        setError(err.message)
      }
    },
    [],
  )

  const loadMore = useCallback(
    async (skip) => {
      try {
        const response = await activityService.getActivities(userId, 20, skip)
        setActivities((prev) => [...prev, ...response.data.activities])
        setHasMore(response.data.hasMore)
      } catch (err) {
        setError(err.message)
      }
    },
    [userId],
  )

  return {
    activities,
    unreadCount,
    loading,
    error,
    hasMore,
    markAsRead,
    deleteActivity,
    loadMore,
  }
}
