import { useState, useEffect, useCallback } from "react"
import { on, off, emit } from "../services/socketService"
import { analyticsService } from "../services/realtimeService"

export const useAnalytics = (userId) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await analyticsService.getAnalytics(userId)
        setAnalytics(response.data)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching analytics:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    const handleAnalyticsUpdate = (data) => {
      if (data.userId === userId) {
        setAnalytics((prev) => ({ ...prev, ...data }))
      }
    }

    on("analytics:updated", handleAnalyticsUpdate)
    return () => off("analytics:updated", handleAnalyticsUpdate)
  }, [userId])

  const updateLearningHours = useCallback(
    async (hours) => {
      try {
        const response = await analyticsService.updateLearningHours(userId, hours)
        setAnalytics(response.data)
        return response.data
      } catch (err) {
        setError(err.message)
        console.error("Error updating learning hours:", err)
      }
    },
    [userId],
  )

  const updateStreak = useCallback(
    async (currentStreak, longestStreak) => {
      try {
        const response = await analyticsService.updateStreak(userId, currentStreak, longestStreak)
        setAnalytics(response.data)
        return response.data
      } catch (err) {
        setError(err.message)
        console.error("Error updating streak:", err)
      }
    },
    [userId],
  )

  const incrementStat = useCallback(
    async (statName, incrementBy = 1) => {
      try {
        const response = await analyticsService.incrementStat(userId, statName, incrementBy)
        setAnalytics(response.data)
        return response.data
      } catch (err) {
        setError(err.message)
        console.error("Error incrementing stat:", err)
      }
    },
    [userId],
  )

  return {
    analytics,
    loading,
    error,
    updateLearningHours,
    updateStreak,
    incrementStat,
  }
}
