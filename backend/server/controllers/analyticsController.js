import Analytics from "../models/Analytics.js"

export async function getOrCreateAnalytics(userId) {
  try {
    let analytics = await Analytics.findOne({ userId })
    if (!analytics) {
      analytics = await Analytics.create({ userId })
    }
    return analytics
  } catch (error) {
    console.error("Error getting/creating analytics:", error)
    throw error
  }
}

export async function getUserAnalytics(userId) {
  try {
    const analytics = await Analytics.findOne({ userId }).lean()
    if (!analytics) {
      throw new Error("Analytics not found")
    }
    return analytics
  } catch (error) {
    console.error("Error fetching analytics:", error)
    throw error
  }
}

export async function updateLearningHours(userId, hours) {
  try {
    const analytics = await Analytics.findOneAndUpdate(
      { userId },
      { $inc: { totalLearningHours: hours } },
      { new: true, upsert: true },
    )
    return analytics
  } catch (error) {
    console.error("Error updating learning hours:", error)
    throw error
  }
}

export async function updateStreakData(userId, newStreak, longestStreak) {
  try {
    const analytics = await Analytics.findOneAndUpdate(
      { userId },
      {
        currentStreak: newStreak,
        longestStreak: Math.max(longestStreak, newStreak),
      },
      { new: true, upsert: true },
    )
    return analytics
  } catch (error) {
    console.error("Error updating streak:", error)
    throw error
  }
}

export async function addWeeklyData(userId, date, hoursLogged, logsCount) {
  try {
    const analytics = await Analytics.findOneAndUpdate(
      { userId },
      {
        $push: {
          weeklyData: { date, hoursLogged, logsCount },
        },
      },
      { new: true, upsert: true },
    )
    return analytics
  } catch (error) {
    console.error("Error adding weekly data:", error)
    throw error
  }
}

export async function incrementStats(userId, statName, incrementBy = 1) {
  try {
    const updateObj = {}
    updateObj[statName] = incrementBy
    const analytics = await Analytics.findOneAndUpdate(
      { userId },
      { $inc: updateObj },
      { new: true, upsert: true },
    )
    return analytics
  } catch (error) {
    console.error(`Error incrementing ${statName}:`, error)
    throw error
  }
}

export async function getAllAnalytics(limit = 100, skip = 0) {
  try {
    const analytics = await Analytics.find()
      .sort({ totalLearningHours: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Analytics.countDocuments()
    return { analytics, total, hasMore: skip + limit < total }
  } catch (error) {
    console.error("Error fetching all analytics:", error)
    throw error
  }
}
